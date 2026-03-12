import { useRAGQuery } from './hooks/useRAGQuery'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'

export default function App() {
  const { messages, isLoading, sendQuery, clearMessages } = useRAGQuery()

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Kortex Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-gray-500 text-xs">Powered by Gemini + Qdrant</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Clear chat
          </button>
        )}
      </div>

      <ChatWindow messages={messages} />
      <ChatInput onSend={sendQuery} isLoading={isLoading} />
    </div>
  )
}
