import MFEErrorBoundary from '../components/MFEErrorBoundary'
import { lazy, Suspense } from 'react'

const ContentApp = lazy(() => import('contentMfe/App'))

function ArticleListSkeleton() {
  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="h-9 bg-gray-800 rounded-lg w-56 mb-3 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-80 animate-pulse" />
        <div className="mt-6 h-px bg-gray-800" />
      </div>
      <div className="flex gap-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 animate-pulse"
            style={{
              backgroundColor: '#0f0f1a',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="h-3 bg-gray-800 rounded mb-4 w-20" />
            <div className="h-5 bg-gray-800 rounded mb-3" />
            <div className="h-3 bg-gray-800 rounded mb-2" />
            <div className="h-3 bg-gray-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function KnowledgePage() {
  return (
    <MFEErrorBoundary mfeName="Knowledge Hub">
      <Suspense fallback={<ArticleListSkeleton />}>
        <ContentApp />
      </Suspense>
    </MFEErrorBoundary>
  )
}
