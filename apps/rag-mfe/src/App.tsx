import { useState } from 'react'
import { useRAGQuery } from './hooks/useRAGQuery'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import UploadPanel from './components/UploadPanel'

export default function App() {
  const { messages, isLoading, sendQuery, clearMessages } = useRAGQuery()
  const [showUpload, setShowUpload] = useState(false)
  const [lastUploaded, setLastUploaded] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-950 text-white">
      {/* Compact header */}
      <div className="flex items-center justify-between px-4 py-1 border-b border-gray-800 bg-gray-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-xs">
            🤖
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-sm">Kortex Assistant</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-gray-500 text-xs">Powered by Gemini + Qdrant</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpload(true)}
            className="text-gray-500 hover:text-gray-300
                       text-xs transition-colors px-2.5 py-1
                       bg-gray-800 rounded-lg hover:bg-gray-700
                       flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>Upload</span>
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors px-2.5 py-1 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Upload success toast */}
      {lastUploaded && (
        <div className="bg-green-500/10 border-b
                        border-green-500/20 px-4 py-2
                        flex items-center justify-between shrink-0">
          <p className="text-green-400 text-xs">
            ✅ "{lastUploaded}" ingested — ask about it now!
          </p>
          <button
            onClick={() => setLastUploaded(null)}
            className="text-green-600 hover:text-green-400
                       text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <ChatWindow messages={messages} />

      <ChatInput
        onSend={sendQuery}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />

      {showUpload && (
        <UploadPanel
          onClose={() => setShowUpload(false)}
          onSuccess={(title) => {
            setLastUploaded(title)
            setShowUpload(false)
          }}
        />
      )}
    </div>
  )
}
