import uuid

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from .config import settings

qdrant = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)

_doc_embeddings = GoogleGenerativeAIEmbeddings(
    model=settings.GEMINI_EMBEDDING_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    task_type="retrieval_document",
)

_query_embeddings = GoogleGenerativeAIEmbeddings(
    model=settings.GEMINI_EMBEDDING_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    task_type="retrieval_query",
)

VECTOR_SIZE = 3072  # gemini-embedding-001 dimensions


def ensure_collection() -> None:
    """Create Qdrant collection, recreating if vector size changed."""
    collections = qdrant.get_collections().collections
    names = [c.name for c in collections]

    if settings.QDRANT_COLLECTION in names:
        info = qdrant.get_collection(settings.QDRANT_COLLECTION)
        existing_size = info.config.params.vectors.size
        if existing_size != VECTOR_SIZE:
            print(f"Vector size mismatch ({existing_size} → {VECTOR_SIZE}), recreating collection...")
            qdrant.delete_collection(settings.QDRANT_COLLECTION)
            names.remove(settings.QDRANT_COLLECTION)

    if settings.QDRANT_COLLECTION not in names:
        qdrant.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )
        print(f"Created collection: {settings.QDRANT_COLLECTION}")
    else:
        print(f"Collection exists: {settings.QDRANT_COLLECTION}")


def embed_text(text: str) -> list[float]:
    """Generate document embedding using Gemini text-embedding-004."""
    return _doc_embeddings.embed_query(text)


def embed_query(text: str) -> list[float]:
    """Generate query embedding using Gemini text-embedding-004."""
    return _query_embeddings.embed_query(text)


def chunk_text(
    text: str,
    chunk_size: int = 512,
    overlap: int = 64,
) -> list[str]:
    """Split text into overlapping chunks by words."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def ingest_article(article: dict, article_text: str) -> int:
    """Chunk, embed and upsert an article into Qdrant. Returns chunk count."""
    chunks = chunk_text(article_text, settings.CHUNK_SIZE, settings.CHUNK_OVERLAP)

    points = []
    for i, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "article_id": article.get("_id", ""),
                    "title": article.get("title", ""),
                    "slug": article.get("slug", ""),
                    "category": article.get("category", ""),
                    "author": article.get("author", ""),
                    "excerpt": article.get("excerpt", ""),
                    "chunk_index": i,
                    "chunk_text": chunk,
                    "published_at": article.get("publishedAt", ""),
                },
            )
        )

    qdrant.upsert(
        collection_name=settings.QDRANT_COLLECTION,
        points=points,
    )
    return len(chunks)


def search_similar(query: str, top_k: int = 5) -> list[dict]:
    """Search for similar chunks in Qdrant."""
    query_embedding = embed_query(query)

    results = qdrant.search(
        collection_name=settings.QDRANT_COLLECTION,
        query_vector=query_embedding,
        limit=top_k,
        with_payload=True,
    )

    return [
        {
            "score": hit.score,
            "chunk_text": hit.payload.get("chunk_text", ""),
            "title": hit.payload.get("title", ""),
            "slug": hit.payload.get("slug", ""),
            "category": hit.payload.get("category", ""),
            "author": hit.payload.get("author", ""),
            "excerpt": hit.payload.get("excerpt", ""),
        }
        for hit in results
    ]
