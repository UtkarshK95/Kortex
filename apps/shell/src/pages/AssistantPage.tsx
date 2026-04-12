import React, { Suspense } from 'react'
import MFEErrorBoundary from '../components/MFEErrorBoundary'

const RAGApp = React.lazy(() => import('ragMfe/App'))

export default function AssistantPage() {
  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <MFEErrorBoundary mfeName="RAG MFE" port="3002">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Loading AI Assistant...
              </div>
            }
          >
            <RAGApp />
          </Suspense>
        </MFEErrorBoundary>
      </div>
    </div>
  )
}
