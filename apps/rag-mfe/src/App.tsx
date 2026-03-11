export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="text-center space-y-4">
        <div className="text-4xl">🤖</div>
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-gray-400">RAG-powered Q&amp;A — coming soon</p>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Loaded from RAG MFE · port 3002
        </span>
      </div>
    </div>
  )
}
