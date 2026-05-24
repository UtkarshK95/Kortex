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

  const isDisabled = !input.trim() || isLoading

  return (
    <>
      <style>{`
        @keyframes kortex-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    <div
      className="px-4 pb-4 pt-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
    >
      {/* Suggested questions — only before first message */}
      {!hasMessages && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 16px 4px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onSend(q)}
              disabled={isLoading}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              className="text-sm px-4 py-2 rounded-full
                         border border-white/15 text-gray-300
                         hover:bg-white/5 hover:border-violet-600/40
                         transition-colors disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        className="flex items-end gap-2 rounded-xl px-4 py-3
                   transition-colors"
        style={{
          backgroundColor: '#0f0f1a',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
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
          className="flex-1 bg-transparent text-white text-sm
                     placeholder-gray-500 overflow-hidden outline-none
                     border-0 ring-0 focus:ring-0 focus:outline-none
                     leading-relaxed disabled:opacity-50 min-h-5 max-h-20"
        />

        {isDisabled ? (
          <button
            disabled
            aria-label="Loading"
            style={{
              backgroundColor: 'rgba(124, 58, 237, 0.4)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: 'none',
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            aria-label="Send"
            style={{
              backgroundColor: '#7c3aed',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'white', fontSize: '18px', lineHeight: 1 }}>↑</span>
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-1.5 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
    </>
  )
}
