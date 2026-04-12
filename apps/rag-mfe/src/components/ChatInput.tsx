import { useState, KeyboardEvent, useRef } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  hasMessages: boolean
}

const SUGGESTED_QUESTIONS = [
  'What is RAG and how does it help enterprises?',
  'Explain cloud migration strategies',
  'What is a headless CMS?',
  'How does data mesh architecture work?',
]

export default function ChatInput({
  onSend,
  isLoading,
  hasMessages,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
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
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        80
      )}px`
    }
  }

  return (
    <div className="bg-gray-950 shrink-0 px-4 pb-4 pt-3 border-t border-gray-800">
      {/* Suggested questions — only before first message */}
      {!hasMessages && (
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
      )}

      {/* Single unified input bar */}
      <div className="flex items-end gap-2 bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700 focus-within:border-indigo-500/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask a question about enterprise knowledge..."
          disabled={isLoading}
          rows={1}
          style={{ resize: 'none' }}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 overflow-hidden outline-none border-0 ring-0 focus:ring-0 focus:outline-none leading-relaxed disabled:opacity-50 min-h-5 max-h-20"
        />

        {/* Up arrow send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-1.5 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
