import { useState } from 'react'
import { useRAGQuery } from './hooks/useRAGQuery'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import UploadPanel from './components/UploadPanel'

export default function App() {
  const { messages, isLoading, sendQuery, clearMessages, provider, setProvider } = useRAGQuery()
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
              <span className="text-gray-500 text-xs">
                {provider === 'gemini' ? 'Gemini 2.5 Flash + Qdrant' : 'Groq Llama 3.3 + Qdrant'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-900/50">
          <div className="relative">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'gemini' | 'groq')}
              className="appearance-none bg-gray-800
                         border border-gray-700 text-white
                         text-xs font-medium rounded-lg
                         pl-3 pr-7 py-1.5 cursor-pointer
                         hover:border-indigo-500/50
                         focus:outline-none focus:border-indigo-500
                         transition-colors"
            >
              <option value="gemini">✦ Gemini</option>
              <option value="groq">⚡ Groq</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0
                            right-2 flex items-center">
              <svg className="w-3 h-3 text-gray-400" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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
