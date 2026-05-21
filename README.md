<div align="center">

<br/>

```
██╗  ██╗ ██████╗ ██████╗ ████████╗███████╗██╗  ██╗
██║ ██╔╝██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝
█████╔╝ ██║   ██║██████╔╝   ██║   █████╗   ╚███╔╝ 
██╔═██╗ ██║   ██║██╔══██╗   ██║   ██╔══╝   ██╔██╗ 
██║  ██╗╚██████╔╝██║  ██║   ██║   ███████╗██╔╝ ██╗
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

**Enterprise Knowledge Portal**

*Micro-Frontends · Headless CMS · Retrieval-Augmented Generation*

<br/>

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-kortex--shell.vercel.app-6d28d9?style=for-the-badge&logo=vercel&logoColor=white)](https://kortex-shell.vercel.app)
[![RAG Service](https://img.shields.io/badge/RAG%20SERVICE-HF%20Spaces-ff6b35?style=for-the-badge&logo=huggingface&logoColor=white)](https://utkarshkatiyar009-kortex-rag-service.hf.space)
[![License](https://img.shields.io/badge/LICENSE-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

![M.Tech](https://img.shields.io/badge/M.Tech%20Dissertation-BITS%20Pilani-003366?style=flat-square)
![Student](https://img.shields.io/badge/Student-Utkarsh%20Katiyar%20%7C%202024TM93147-7c3aed?style=flat-square)
![Status](https://img.shields.io/badge/Status-Complete%20%E2%9C%85-16a34a?style=flat-square)

</div>

---

## What is Kortex?

Kortex is a production-deployed enterprise knowledge portal built as an M.Tech dissertation at BITS Pilani. It demonstrates how three architectural paradigms — **Micro-Frontend composition**, **Headless Content Management**, and **Retrieval-Augmented Generation** — can be integrated into a single coherent, independently deployable system.

The core thesis: enterprise platforms can be modular at every layer — frontend, content, and AI — without sacrificing integration or developer experience.

```
Ask anything about your enterprise content.
Get grounded answers with source citations.
No hallucinations. No retraining required.
```

---

## Architecture at a Glance

```
                         ┌─────────────────────────────────────────┐
                         │           Browser (User)                │
                         └──────────────────┬──────────────────────┘
                                            │
                    ┌───────────────────────▼──────────────────────┐
                    │        Shell App — Module Federation Host    │
                    │     Routing · Clerk Auth · MF Composition    │
                    │           kortex-shell.vercel.app            │
                    └────────┬──────────────────────┬──────────────┘
                             │ lazy loads           │ lazy loads
              ┌──────────────▼──────┐    ┌──────────▼──────────────┐
              │   Content MFE       │    │      RAG MFE            │
              │  /knowledge route   │    │   /assistant route      │
              │  Article listing    │    │   Streaming AI chat     │
              │  Portable Text      │    │   Dynamic upload        │
              │  Category filters   │    │   Provider switcher     │
              └──────────┬──────────┘    └──────────┬──────────────┘
                         │ GROQ API                 │ HTTP / SSE
              ┌──────────▼──────────┐    ┌──────────▼──────────────┐
              │    Sanity CMS       │    │     RAG Service         │
              │   Cloud hosted      │◄───│   FastAPI · Python 3.12 │
              │   Webhook on publish│    │   LangChain pipeline    │
              └─────────────────────┘    └──────┬────────┬─────────┘
                                                │        │
                                   ┌────────────▼─┐  ┌──▼─────────────┐
                                   │ Qdrant Cloud │  │  Gemini / Groq │
                                   │ kortex_know..│  │  Embed + LLM   │
                                   │ 3072-dim vec │  │  Provider swap │
                                   └──────────────┘  └────────────────┘
```

---

## Features

### 🧩 Micro-Frontend Architecture
- Three independently deployable Vite 6 + React 18 applications
- Runtime composition via `@module-federation/vite` (pinned `1.12.3`)
- Shell acts as Module Federation host — remotes load from separate Vercel deployments
- Each MFE has its own CI/CD pipeline; updating one never rebuilds the others

### 📚 Headless CMS Integration
- Sanity CMS with custom Article + Category schemas
- GROQ query language for expressive content fetching
- Real-time webhook pipeline: publish an article → HMAC-validated → auto re-ingested into vector store within seconds

### 🤖 RAG Pipeline
- **Ingestion:** LangChain `RecursiveCharacterTextSplitter` (512 tokens, 50 overlap) → `gemini-embedding-001` (3072 dims) → Qdrant upsert
- **Query:** Embed question → cosine similarity search (top 5) → context block → LLM generation → SSE stream
- **Faithfulness score: 1.0** — zero hallucinations across all evaluated queries (RAGAS)
- Every answer includes source citations with article title, category, and author

### ⚡ Dynamic Knowledge Upload *(Post-Viva Enhancement)*
- Upload any PDF or paste text directly into the knowledge base from the chat interface
- Browser-side PDF extraction via `pdfjs-dist` — no server-side PDF processing
- Immediately queryable after ingestion — no restart or redeployment needed

### 🔀 Modular AI Provider Switching *(Post-Viva Enhancement)*
- Toggle between **Gemini 2.5 Flash** and **Groq Llama 3.3** from the UI
- Provider abstraction at the generation layer only — retrieval pipeline is identical for both
- Zero changes to embeddings, chunking, or vector search when switching providers

### 🔐 Authentication *(Post-Viva Enhancement)*
- Clerk-powered Google + GitHub OAuth at the shell level
- `ClerkProvider` wraps the entire application tree
- Conditional rendering with `SignedIn` / `SignedOut` components

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Monorepo** | Turborepo + pnpm workspaces | Parallel builds, shared caching |
| **MFE Framework** | @module-federation/vite `1.12.3` | ⚠️ Exact pin — no caret |
| **Frontend** | Vite 6 + React 18 | Replaced Next.js (RSC + MF incompatible) |
| **Styling** | Tailwind CSS v4 | `@import "tailwindcss"` syntax |
| **State** | Zustand | Shell-level global state |
| **Auth** | Clerk | Google + GitHub OAuth |
| **CMS** | Sanity Cloud | GROQ, Portable Text, webhooks |
| **RAG Backend** | FastAPI (Python 3.12) | Async, SSE streaming |
| **Embeddings** | gemini-embedding-001 | 3072 dimensions |
| **LLM Primary** | Gemini 2.5 Flash | Default provider |
| **LLM Secondary** | Groq Llama 3.3 | Provider switching demo |
| **Vector DB** | Qdrant Cloud | `kortex_knowledge`, cosine similarity |
| **PDF Parsing** | pdfjs-dist | Browser-side extraction |
| **Containerisation** | Docker Compose | RAG service only |
| **Deployment** | Vercel + HF Spaces | MFEs on Vercel, RAG on HF Spaces |

---

## Repository Structure

```
kortex/
├── apps/
│   ├── shell/              # MF Host — port 3000
│   │   └── src/
│   │       ├── components/ # Navbar, MFEErrorBoundary
│   │       ├── pages/      # HomePage, KnowledgePage, AssistantPage
│   │       └── store/      # useKortexStore (Zustand)
│   ├── content-mfe/        # MF Remote — port 3001
│   │   └── src/
│   │       ├── components/ # ArticleCard, ArticleList, ArticleDetail
│   │       ├── hooks/      # useSanityArticles
│   │       └── lib/        # sanity.ts, queries.ts
│   └── rag-mfe/            # MF Remote — port 3002
│       └── src/
│           ├── components/ # ChatWindow, ChatInput, UploadModal
│           └── hooks/      # useRAGQuery (SSE streaming)
├── services/
│   └── rag-service/        # FastAPI — port 8000 / 7860 (HF Spaces)
│       ├── app/
│       │   ├── config.py         # Pydantic settings
│       │   ├── sanity_client.py  # Sanity REST API client
│       │   ├── vector_store.py   # Qdrant ops + self-healing
│       │   ├── rag_pipeline.py   # Retrieve → generate → stream
│       │   └── main.py           # FastAPI app + CORS + endpoints
│       ├── Dockerfile
│       └── requirements.txt
├── cms/
│   └── sanity/             # Sanity Studio — port 3333
│       └── schemaTypes/    # article.ts, category.ts
├── evaluation/
│   ├── ragas/evaluate.py   # RAGAS quality evaluation
│   ├── k6/load_test.js     # k6 load testing
│   └── test_webhook.sh     # HMAC webhook test
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Evaluation Results

### RAG Quality — RAGAS Framework

| Metric | Score | Target | Result |
|--------|-------|--------|--------|
| **Faithfulness** | **1.000** | > 0.80 | ✅ Met |
| Answer Relevancy | 0.517 | > 0.75 | ⚠️ Corpus size constraint |
| **Context Recall** | **0.900** | > 0.70 | ✅ Met |
| Context Precision | 0.200 | > 0.65 | ⚠️ Corpus size constraint |
| **Overall** | **0.654** | — | — |

> Faithfulness of **1.0** means the system generated zero claims outside the retrieved context across all evaluated queries.

### Load Performance — k6

| Scenario | VUs | P95 Latency | Error Rate |
|----------|-----|-------------|------------|
| Baseline | 1 | ~22s | 0% |
| Concurrent | 10 | Timeout | ~15% |
| Stress | 20 | Timeout | 79% |

> Breaking point: **~10 concurrent users** — constrained by Gemini free-tier rate limits (15 RPM), not the architecture.

---

## Running Locally

### Prerequisites
- Node.js 20+, pnpm 9+
- Python 3.12+
- Active accounts: Gemini API, Groq, Sanity, Qdrant Cloud, Clerk

### Setup

```bash
# Clone
git clone https://github.com/UtkarshK95/Kortex.git
cd Kortex

# Install all workspace dependencies
pnpm install

# Sanity Studio (must be separate)
cd cms/sanity && pnpm install --ignore-workspace && cd ../..

# Setup environment
cp .env.example .env
cp .env services/rag-service/.env
echo "ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002" >> services/rag-service/.env
# Fill in your API keys in .env
```

### Start Services

> ⚠️ Start in this order — Shell requires remotes to be running first (MF eager init)

```bash
# Tab 1 — RAG Service
cd services/rag-service
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Tab 2 — Content MFE
pnpm --filter content-mfe dev

# Tab 3 — RAG MFE
pnpm --filter rag-mfe dev

# Tab 4 — Shell
pnpm --filter shell dev

# Tab 5 — Sanity Studio (optional)
cd cms/sanity && pnpm dev
```

### Verify

```bash
curl http://localhost:8000/health  # RAG service
curl http://localhost:3001          # Content MFE
curl http://localhost:3002          # RAG MFE
# Open http://localhost:3000        # Shell
```

### Ingest content

```bash
curl -X POST http://localhost:8000/ingest
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio — active billing required |
| `GROQ_API_KEY` | console.groq.com — free tier, no CC |
| `SANITY_PROJECT_ID` | Sanity dashboard project ID |
| `SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Sanity API token with read permissions |
| `SANITY_WEBHOOK_SECRET` | HMAC secret for webhook validation |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud API key |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_CLERK_PUBLISHABLE_KEY` | Same value — required at Vite build time |
| `VITE_CONTENT_MFE_URL` | Content MFE production URL (shell build) |
| `VITE_RAG_MFE_URL` | RAG MFE production URL (shell build) |
| `VITE_RAG_SERVICE_URL` | RAG service production URL (RAG MFE build) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

---

## Key Engineering Decisions

**Why Vite over Next.js?**
Next.js 14 App Router uses React Server Components (RSC). RSC's server-side streaming model is fundamentally incompatible with Module Federation's eager initialisation requirement. The migration to Vite resolved this completely.

**Why exact pin on `@module-federation/vite`?**
`^1.12.3` allows silent auto-upgrade to `1.14.x`, which breaks all remote loading without any clear error message. After experiencing this after a 15-day development gap, all three MFE packages were pinned to exact `"1.12.3"` with no caret.

**Why Qdrant over Pinecone?**
Qdrant Cloud free tier has no cold-start latency. A dissertation prototype that makes users wait for a service to wake up is not a useful demonstration of anything.

**Why direct Sanity REST API over the SDK?**
The `sanity-client` PyPI package produced malformed query results against the GROQ endpoint in testing. Direct HTTP calls to the REST API proved more reliable and are simpler to debug.

**Self-healing vector store**
`vector_store.py` checks the Qdrant collection dimensions at startup. If there is a mismatch (e.g. collection was created with 768-dim embeddings before switching to `gemini-embedding-001` at 3072-dim), it auto-deletes and recreates the collection. This prevents silent retrieval failures.

---

## Production Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Shell App | Vercel | [kortex-shell.vercel.app](https://kortex-shell.vercel.app) |
| Content MFE | Vercel | kortex-content-mfe.vercel.app |
| RAG MFE | Vercel | kortex-rag-mfe.vercel.app |
| RAG Service | Hugging Face Spaces | [utkarshkatiyar009-kortex-rag-service.hf.space](https://utkarshkatiyar009-kortex-rag-service.hf.space) |
| Vector DB | Qdrant Cloud | `kortex_knowledge` collection |
| CMS | Sanity Cloud | Managed |

---

## Demo

**Best demo question:** *"What are the phases of cloud migration?"*

Demonstrates the full RAG flow:
- Question embedded → Qdrant cosine search → top 5 chunks retrieved
- Gemini 2.5 Flash generates answer conditioned on context
- Response streams token by token via SSE
- Source citation shown: *Cloud Migration Strategy for Enterprise Applications* by Priya Sharma

---

## About

**Dissertation:** A Scalable Architectural Solution for Web Platforms Using Micro-Frontends, Headless CMS, and Retrieval-Augmented Generation for Intelligent Content Access

**Programme:** M.Tech Software Engineering — BITS Pilani WILP Division

**Student:** Utkarsh Katiyar `2024TM93147`

**Supervisor:** Arvind Kumar, Associate Director, Harman International, Bangalore

---

<div align="center">

Built with obsessive attention to architecture detail.

*BITS Pilani · May 2026*

</div>
