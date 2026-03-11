import MFEErrorBoundary from '../components/MFEErrorBoundary'
import { lazy, Suspense } from 'react'

const ContentApp = lazy(() => import('contentMfe/App'))

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2
                    lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i}
             className="bg-gray-900 border border-gray-800
                        rounded-xl p-6 animate-pulse">
          <div className="h-3 bg-gray-800 rounded mb-4 w-20" />
          <div className="h-5 bg-gray-800 rounded mb-3" />
          <div className="h-3 bg-gray-800 rounded mb-2" />
          <div className="h-3 bg-gray-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default function KnowledgePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-3xl font-bold text-white">
            Knowledge Hub
          </h1>
        </div>
        <p className="text-gray-400">
          Browse articles, case studies, and service offerings
        </p>
        <div className="mt-3 inline-flex items-center gap-2
                        bg-indigo-500/10 border border-indigo-500/20
                        rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-indigo-400
                          animate-pulse" />
          <span className="text-indigo-400 text-xs font-medium">
            Loaded from Content MFE · port 3001
          </span>
        </div>
      </div>

      <MFEErrorBoundary mfeName="Content MFE" port="3001">
        <Suspense fallback={<ArticleListSkeleton />}>
          <ContentApp />
        </Suspense>
      </MFEErrorBoundary>
    </div>
  )
}
