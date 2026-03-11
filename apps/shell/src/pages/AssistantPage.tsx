import MFEErrorBoundary from '../components/MFEErrorBoundary'
import { lazy, Suspense } from 'react'

const RagApp = lazy(() => import('ragMfe/App'))

function ChatSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800
                    rounded-xl p-6 animate-pulse">
      <div className="h-96 flex items-end gap-3">
        <div className="flex-1 h-12 bg-gray-800 rounded-xl" />
        <div className="w-12 h-12 bg-gray-800 rounded-xl" />
      </div>
    </div>
  )
}

export default function AssistantPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🤖</span>
          <h1 className="text-3xl font-bold text-white">
            AI Assistant
          </h1>
        </div>
        <p className="text-gray-400">
          Ask questions, get answers grounded in enterprise content
        </p>
        <div className="mt-3 inline-flex items-center gap-2
                        bg-indigo-500/10 border border-indigo-500/20
                        rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-indigo-400
                          animate-pulse" />
          <span className="text-indigo-400 text-xs font-medium">
            Loaded from RAG MFE · port 3002
          </span>
        </div>
      </div>

      <MFEErrorBoundary mfeName="RAG MFE" port="3002">
        <Suspense fallback={<ChatSkeleton />}>
          <RagApp />
        </Suspense>
      </MFEErrorBoundary>
    </div>
  )
}
