import hashlib
import hmac
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from .config import settings
from .rag_pipeline import query_rag, stream_rag, stream_rag_groq
from .sanity_client import article_to_text, fetch_articles
from .vector_store import ensure_collection, ingest_article, qdrant


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Kortex RAG Service starting...")
    ensure_collection()
    print("Qdrant collection ready.")
    yield
    print("Kortex RAG Service shutting down.")


app = FastAPI(
    title="Kortex RAG Service",
    description="RAG pipeline for Kortex Knowledge Portal",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = settings.ALLOWED_ORIGINS
if allowed_origins == ["*"]:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# ── Models ────────────────────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5
    stream: bool = False
    provider: str = "gemini"  # "gemini" or "groq"


class IngestResponse(BaseModel):
    success: bool
    articles_ingested: int
    total_chunks: int
    message: str


class DocumentIngestRequest(BaseModel):
    title: str
    content: str
    category: str = "User Upload"
    author: str = "Manual Upload"
    source: str = "dynamic"
    uploaded_at: str = ""


class DocumentIngestResponse(BaseModel):
    success: bool
    chunks_stored: int
    message: str


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "kortex-rag", "version": "1.0.0"}


# ── Ingestion ─────────────────────────────────────────────────────────────────

@app.post("/ingest", response_model=IngestResponse)
async def ingest():
    """Fetch all articles from Sanity and ingest into Qdrant."""
    try:
        articles = fetch_articles()
        if not articles:
            return IngestResponse(
                success=True,
                articles_ingested=0,
                total_chunks=0,
                message="No articles found in Sanity CMS",
            )

        total_chunks = 0
        for article in articles:
            text = article_to_text(article)
            if text.strip():
                total_chunks += ingest_article(article, text)

        return IngestResponse(
            success=True,
            articles_ingested=len(articles),
            total_chunks=total_chunks,
            message=f"Successfully ingested {len(articles)} articles ({total_chunks} chunks)",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/ingest/document", response_model=DocumentIngestResponse)
async def ingest_document(request: DocumentIngestRequest):
    """
    Ingest a single document directly from text content.
    Content is immediately chunked, embedded, and stored
    in Qdrant — queryable right away.
    """
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    if not request.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    try:
        article = {
            "_id": f"dynamic-{hash(request.title + request.content)}",
            "title": request.title,
            "slug": request.title.lower().replace(" ", "-"),
            "category": request.category,
            "author": request.author,
            "excerpt": (
                request.content[:200] + "..."
                if len(request.content) > 200
                else request.content
            ),
            "publishedAt": request.uploaded_at,
            "source": request.source,
        }

        article_text = (
            f"Title: {request.title}\n"
            f"Category: {request.category}\n"
            f"Author: {request.author}\n\n"
            f"Content:\n{request.content}"
        )

        chunks_stored = ingest_article(article, article_text)

        return DocumentIngestResponse(
            success=True,
            chunks_stored=chunks_stored,
            message=(
                f"Successfully ingested '{request.title}' "
                f"({chunks_stored} chunks stored)"
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


# ── Webhook ───────────────────────────────────────────────────────────────────

@app.post("/webhook/sanity")
async def sanity_webhook(request: Request):
    """Sanity webhook — triggers re-ingestion on publish."""
    body = await request.body()
    signature = request.headers.get("sanity-webhook-signature")

    if settings.WEBHOOK_SECRET and signature:
        expected = hmac.new(
            settings.WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(f"sha256={expected}", signature):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")

    articles = fetch_articles()
    total_chunks = 0
    for article in articles:
        text = article_to_text(article)
        if text.strip():
            total_chunks += ingest_article(article, text)

    return {
        "success": True,
        "message": f"Re-ingested {len(articles)} articles, {total_chunks} chunks",
    }


# ── Documents ────────────────────────────────────────────────────────────────

@app.get("/documents")
async def list_documents():
    """Return unique uploaded documents (deduplicated by title) from Qdrant."""
    try:
        all_points = []
        offset = None
        while True:
            batch, next_offset = qdrant.scroll(
                collection_name=settings.QDRANT_COLLECTION,
                offset=offset,
                limit=100,
                with_payload=True,
                with_vectors=False,
            )
            all_points.extend(batch)
            if next_offset is None:
                break
            offset = next_offset

        seen: dict[str, dict] = {}
        for point in all_points:
            payload = point.payload or {}
            article_id = payload.get("article_id", "")
            source = payload.get("source", "")
            # Only surface user-uploaded documents
            if not (article_id.startswith("dynamic-") or source == "dynamic"):
                continue
            title = payload.get("title", "")
            if not title or title in seen:
                continue
            seen[title] = {
                "title": title,
                "category": payload.get("category", "User Upload"),
                "author": payload.get("author", "Manual Upload"),
                "excerpt": payload.get("excerpt", ""),
                "source": "Manual Upload",
                "uploaded_at": payload.get("published_at", ""),
            }

        return list(seen.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")


# ── Query ─────────────────────────────────────────────────────────────────────

@app.post("/query")
async def query(request: QueryRequest):
    """Non-streaming RAG query endpoint."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        return query_rag(request.question, top_k=request.top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/query/stream")
async def query_stream(request: QueryRequest):
    """Streaming RAG query endpoint via SSE."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    async def generate():
        sources_sent = False
        try:
            if request.provider == "groq":
                pipeline = stream_rag_groq(request.question, top_k=request.top_k)
            else:
                pipeline = stream_rag(request.question, top_k=request.top_k)

            for text_chunk, sources in pipeline:
                yield {
                    "event": "chunk",
                    "data": json.dumps({"text": text_chunk}),
                }
                if not sources_sent:
                    yield {
                        "event": "sources",
                        "data": json.dumps({"sources": sources}),
                    }
                    sources_sent = True

            yield {
                "event": "done",
                "data": json.dumps({"status": "complete"}),
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(generate())
