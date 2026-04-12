import { useRAGQuery } from './hooks/useRAGQuery'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'

export default function App() {
  const { messages, isLoading, sendQuery, clearMessages } = useRAGQuery()

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
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors px-2.5 py-1 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Clear chat
          </button>
        )}
      </div>

      <ChatWindow messages={messages} />

      <ChatInput
        onSend={sendQuery}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />
    </div>
  )
}
