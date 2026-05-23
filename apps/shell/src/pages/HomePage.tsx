import { Link } from 'react-router-dom'
import { useAuth, useClerk } from '@clerk/react'
import { BookOpen, Bot, Upload } from 'lucide-react'

const features = [
  {
    Icon: BookOpen,
    title: 'Knowledge Hub',
    desc: 'Browse articles powered by Sanity CMS with real-time content updates via webhooks',
    href: '/knowledge',
  },
  {
    Icon: Bot,
    title: 'AI Assistant',
    desc: 'Natural language Q&A grounded in your content via RAG — no hallucinations, only cited answers',
    href: '/assistant',
  },
  {
    Icon: Upload,
    title: 'Dynamic Upload',
    desc: 'Instantly ingest PDFs or text into the knowledge base without redeployment',
    href: '/assistant',
  },
]

const architecture = [
  {
    icon: '🧩',
    title: 'Micro-Frontends',
    desc: 'Shell + 2 independently deployed MFEs via Module Federation',
  },
  {
    icon: '🏗️',
    title: 'Headless CMS',
    desc: 'Content managed in Sanity, delivered via GROQ API',
  },
  {
    icon: '🔍',
    title: 'RAG Pipeline',
    desc: 'Gemini embeddings + Qdrant vector search for grounded answers',
  },
  {
    icon: '🤖',
    title: 'Multi-LLM',
    desc: 'Pluggable AI providers: Gemini 2.5 Flash + Groq Llama 3.3',
  },
  {
    icon: '🔐',
    title: 'Authentication',
    desc: 'Clerk-powered Google + GitHub OAuth, production-ready',
  },
  {
    icon: '⚡',
    title: 'Real-time Sync',
    desc: 'Sanity webhook → auto re-ingestion → queryable in seconds',
  },
]

export default function HomePage() {
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  function handleProtectedClick(e: React.MouseEvent) {
    if (!isSignedIn) {
      e.preventDefault()
      openSignIn()
    }
  }

  return (
    <div
      className="min-h-screen text-white pb-20 md:pb-0"
      style={{ backgroundColor: '#0a0a0f' }}
    >

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 flex flex-col
                          items-center text-center">
        {/* Animated orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-5%',
            left: '20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'kortex-orb-1 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-10%',
            right: '15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'kortex-orb-2 12s ease-in-out infinite',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight
                         leading-tight mb-6">
            Welcome to{' '}
            <span className="bg-linear-to-r from-blue-400 to-violet-500
                             bg-clip-text text-transparent">
              Kortex
            </span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed mb-10
                        max-w-2xl mx-auto">
            An enterprise knowledge portal combining modular
            micro-frontends, headless content management, and AI-powered
            retrieval for intelligent access to organizational knowledge.
          </p>
          <div className="flex flex-col sm:flex-row items-center
                          justify-center gap-4">
            <Link
              to="/knowledge"
              onClick={handleProtectedClick}
              className="px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-700
                         text-white font-semibold text-sm transition-all
                         duration-200 hover:-translate-y-0.5
                         hover:shadow-lg hover:shadow-violet-500/25"
            >
              Browse Knowledge →
            </Link>
            <Link
              to="/assistant"
              onClick={handleProtectedClick}
              className="px-7 py-3 rounded-xl border border-violet-600/50
                         hover:border-violet-500 text-violet-400
                         hover:text-violet-300 font-semibold text-sm
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              Ask AI Assistant →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-gray-500
                      uppercase mb-10 text-center">
          Platform Capabilities
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ Icon, title, desc, href }) => (
            <Link
              key={title}
              to={href}
              onClick={handleProtectedClick}
              className="group rounded-2xl p-6 transition-all duration-300
                         hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: '#0f0f1a',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="inline-flex items-center justify-center
                            w-10 h-10 rounded-xl mb-5"
                style={{ backgroundColor: 'rgba(124,58,237,0.15)' }}
              >
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-white font-semibold text-xl whitespace-nowrap">
            Architecture
          </h2>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {architecture.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: '#0f0f1a',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl leading-none mt-0.5">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">
                    {title}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
