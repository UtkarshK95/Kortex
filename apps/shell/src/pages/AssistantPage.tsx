import MFEErrorBoundary from '../components/MFEErrorBoundary'
import { lazy, Suspense } from 'react'

const RagApp = lazy(() => import('ragMfe/App'))

function ChatSkeleton() {
  return (
    <div className="h-full bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-full flex items-end gap-3">
        <div className="flex-1 h-12 bg-gray-800 rounded-xl" />
        <div className="w-12 h-12 bg-gray-800 rounded-xl" />
      </div>
    </div>
  )
}

export default function AssistantPage() {
  return (
    <div className="px-8 pt-8 pb-8 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Page header */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🤖</span>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Ask questions, get answers grounded in enterprise content
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-xs font-medium">Loaded from RAG MFE · port 3002</span>
        </div>
      </div>

      {/* MFE container — flex-1 + min-h-0 lets it shrink, display:flex passes height to child */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden border border-gray-800">
        <MFEErrorBoundary mfeName="RAG MFE" port="3002">
          <Suspense fallback={<ChatSkeleton />}>
            <RagApp />
          </Suspense>
        </MFEErrorBoundary>
      </div>
    </div>
  )
}
