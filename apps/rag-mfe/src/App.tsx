import { useState } from 'react'
import { useRAGQuery } from './hooks/useRAGQuery'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import UploadPanel from './components/UploadPanel'
import { Upload } from 'lucide-react'

export default function App() {
  const {
    messages,
    isLoading,
    sendQuery,
    clearMessages,
    provider,
    setProvider,
  } = useRAGQuery()
  const [showUpload, setShowUpload] = useState(false)
  const [lastUploaded, setLastUploaded] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-950 text-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          backgroundColor: '#0f0f1a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Left: title + model */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">Kortex Assistant</span>
          <span className="text-gray-600 text-xs">·</span>
          <span className="text-gray-500 text-xs">
            {provider === 'gemini'
              ? 'Gemini 2.5 Flash + Qdrant'
              : 'Groq Llama 3.3 + Qdrant'}
          </span>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3">
          {/* Provider switcher */}
          <div className="relative">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'gemini' | 'groq')}
              className="appearance-none text-violet-400 text-xs font-medium
                         rounded-full pl-3 pr-7 py-1.5 cursor-pointer
                         focus:outline-none transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(124,58,237,0.5)',
              }}
            >
              <option value="gemini" style={{ backgroundColor: '#0f0f1a' }}>
                ✦ Gemini
              </option>
              <option value="groq" style={{ backgroundColor: '#0f0f1a' }}>
                ⚡ Groq
              </option>
            </select>
          </div>

          {/* Upload */}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300
                       text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          {/* Clear chat */}
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Upload success toast */}
      {lastUploaded && (
        <div
          className="bg-green-500/10 border-b border-green-500/20
                        px-4 py-2 flex items-center justify-between shrink-0"
        >
          <p className="text-green-400 text-xs">
            ✅ "{lastUploaded}" ingested — ask about it now!
          </p>
          <button
            onClick={() => setLastUploaded(null)}
            className="text-green-600 hover:text-green-400 text-xs ml-4"
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
