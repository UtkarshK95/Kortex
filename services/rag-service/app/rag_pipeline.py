import google.generativeai as genai
from groq import Groq

from .config import settings
from .vector_store import search_similar

genai.configure(api_key=settings.GEMINI_API_KEY)

RAG_SYSTEM_PROMPT = """You are Kortex Assistant, an intelligent knowledge retrieval system for an enterprise consulting portal.

Your role is to answer questions accurately using ONLY the provided context from the knowledge base.

Rules:
- Answer based strictly on the provided context
- If the context doesn't contain enough information, say so clearly
- Always cite which article(s) your answer is based on
- Be concise but comprehensive
- Use a professional, helpful tone
- Format your response in clear paragraphs

Context from Knowledge Base:
{context}
"""


def build_context(chunks: list[dict]) -> str:
    """Build context string from retrieved chunks."""
    if not chunks:
        return "No relevant content found."

    context_parts = []
    seen_titles: set[str] = set()

    for chunk in chunks:
        title = chunk.get("title", "Unknown")
        if title not in seen_titles:
            seen_titles.add(title)
            context_parts.append(f"--- Article: {title} ---\n{chunk['chunk_text']}")
        else:
            context_parts.append(chunk["chunk_text"])

    return "\n\n".join(context_parts)


def get_sources(chunks: list[dict]) -> list[dict]:
    """Extract unique source articles from chunks."""
    seen: set[str] = set()
    sources = []
    for chunk in chunks:
        slug = chunk.get("slug", "")
        if slug and slug not in seen:
            seen.add(slug)
            sources.append(
                {
                    "title": chunk.get("title", ""),
                    "slug": slug,
                    "category": chunk.get("category", ""),
                    "author": chunk.get("author", ""),
                    "excerpt": chunk.get("excerpt", ""),
                }
            )
    return sources


def query_rag(question: str, top_k: int = 5) -> dict:
    """Full RAG pipeline: retrieve → build context → generate answer."""
    chunks = search_similar(question, top_k=top_k)
    context = build_context(chunks)
    sources = get_sources(chunks)

    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=RAG_SYSTEM_PROMPT.format(context=context),
    )

    response = model.generate_content(question)

    return {
        "answer": response.text,
        "sources": sources,
        "chunks_retrieved": len(chunks),
    }


def stream_rag(question: str, top_k: int = 5):
    """Streaming RAG pipeline. Yields (text_chunk, sources) tuples."""
    chunks = search_similar(question, top_k=top_k)
    context = build_context(chunks)
    sources = get_sources(chunks)

    model = genai.GenerativeModel(
        model_name=settings.GEMINI_LLM_MODEL,
        system_instruction=RAG_SYSTEM_PROMPT.format(context=context),
    )

    response = model.generate_content(question, stream=True)

    for chunk in response:
        if chunk.text:
            yield chunk.text, sources


def stream_rag_groq(question: str, top_k: int = 5):
    """Streaming RAG pipeline using Groq / Llama 3.3."""
    chunks = search_similar(question, top_k=top_k)
    context = build_context(chunks)
    sources = get_sources(chunks)

    client = Groq(api_key=settings.GROQ_API_KEY)

    stream = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": RAG_SYSTEM_PROMPT.format(context=context),
            },
            {"role": "user", "content": question},
        ],
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta.content:
            yield delta.content, sources
