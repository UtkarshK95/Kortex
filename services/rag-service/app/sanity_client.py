import requests
from .config import settings

SANITY_API_BASE = (
    f"https://{settings.SANITY_PROJECT_ID}"
    f".api.sanity.io/v2024-01-01/data/query"
    f"/{settings.SANITY_DATASET}"
)

ARTICLES_QUERY = """
*[_type == "article"] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  "category": category->name,
  "categorySlug": category->slug.current,
  tags,
  author,
  readTime,
  publishedAt
}
"""


def fetch_articles() -> list[dict]:
    """Fetch all articles from Sanity CMS."""
    headers = {"Authorization": f"Bearer {settings.SANITY_API_TOKEN}"}
    params = {"query": ARTICLES_QUERY}

    response = requests.get(
        SANITY_API_BASE,
        headers=headers,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("result", [])


def block_to_text(body: list | None) -> str:
    """Convert Sanity Portable Text blocks to plain text."""
    if not body:
        return ""
    paragraphs = []
    for block in body:
        if block.get("_type") != "block":
            continue
        children = block.get("children", [])
        text = "".join(child.get("text", "") for child in children)
        if text.strip():
            paragraphs.append(text.strip())
    return "\n\n".join(paragraphs)


def article_to_text(article: dict) -> str:
    """Convert a full article to indexable plain text."""
    parts = []
    if article.get("title"):
        parts.append(f"Title: {article['title']}")
    if article.get("category"):
        parts.append(f"Category: {article['category']}")
    if article.get("author"):
        parts.append(f"Author: {article['author']}")
    if article.get("tags"):
        parts.append(f"Tags: {', '.join(article['tags'])}")
    if article.get("excerpt"):
        parts.append(f"Summary: {article['excerpt']}")
    body_text = block_to_text(article.get("body", []))
    if body_text:
        parts.append(f"Content:\n{body_text}")
    return "\n\n".join(parts)
