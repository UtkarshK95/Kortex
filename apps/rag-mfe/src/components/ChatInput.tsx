import { useState, KeyboardEvent, useRef } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

const SUGGESTED_QUESTIONS = [
  'What is RAG and how does it help enterprises?',
  'Explain cloud migration strategies',
  'What is a headless CMS?',
  'How does data mesh architecture work?',
]

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="border-t border-gray-800 p-4">
      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSend(q)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-full border border-gray-700 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-end gap-3 bg-gray-800 border border-gray-700 rounded-xl p-3 focus-within:border-indigo-500/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask a question about enterprise knowledge..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none outline-none leading-relaxed disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
