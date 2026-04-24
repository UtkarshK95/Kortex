import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_EMBEDDING_MODEL: str = "models/gemini-embedding-001"
    GEMINI_LLM_MODEL: str = "gemini-2.5-flash"

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Qdrant
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "kortex_knowledge")

    # Sanity
    SANITY_PROJECT_ID: str = os.getenv("SANITY_PROJECT_ID", "")
    SANITY_DATASET: str = os.getenv("SANITY_DATASET", "production")
    SANITY_API_TOKEN: str = os.getenv("SANITY_API_TOKEN", "")

    # Service
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "")
    RAG_SERVICE_PORT: int = int(os.getenv("RAG_SERVICE_PORT", "8000"))
    ALLOWED_ORIGINS: list[str] = os.getenv(
        "ALLOWED_ORIGINS", "*"
    ).split(",")

    # RAG
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 64
    RETRIEVAL_TOP_K: int = 5
    RERANK_TOP_K: int = 3


settings = Settings()
