import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to{' '}
          <span className="text-indigo-400">Kortex</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed
                      max-w-2xl">
          An enterprise knowledge portal combining modular
          micro-frontends, headless content management, and
          AI-powered retrieval for intelligent access to
          organizational knowledge.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link
          to="/knowledge"
          className="bg-gray-900 border border-gray-800
                     rounded-xl p-6 hover:border-indigo-500/50
                     transition-all group"
        >
          <div className="text-3xl mb-4">📚</div>
          <h2 className="text-white font-semibold text-lg mb-2">
            Knowledge Hub
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Browse articles, case studies, and service offerings
            powered by Sanity CMS.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-indigo-400 text-sm
                             group-hover:text-indigo-300">
              Browse content →
            </span>
            <span className="text-xs text-gray-600
                             font-mono bg-gray-800 px-2 py-1
                             rounded">
              content-mfe:3001
            </span>
          </div>
        </Link>

        <Link
          to="/assistant"
          className="bg-gray-900 border border-gray-800
                     rounded-xl p-6 hover:border-indigo-500/50
                     transition-all group"
        >
          <div className="text-3xl mb-4">🤖</div>
          <h2 className="text-white font-semibold text-lg mb-2">
            AI Assistant
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Ask natural language questions and get accurate
            answers grounded in enterprise content via RAG.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-indigo-400 text-sm
                             group-hover:text-indigo-300">
              Ask a question →
            </span>
            <span className="text-xs text-gray-600
                             font-mono bg-gray-800 px-2 py-1
                             rounded">
              rag-mfe:3002
            </span>
          </div>
        </Link>
      </div>

      {/* Architecture info */}
      <div className="bg-gray-900 border border-gray-800
                      rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">
          Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Micro-Frontends',
              desc: 'Shell + 2 independently deployed MFEs via Module Federation',
              icon: '🧩',
            },
            {
              title: 'Headless CMS',
              desc: 'Content managed in Sanity, delivered via API',
              icon: '📝',
            },
            {
              title: 'RAG Pipeline',
              desc: 'Gemini + Qdrant for intelligent content retrieval',
              icon: '🔍',
            },
          ].map((item) => (
            <div key={item.title}
                 className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">
                  {item.title}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
