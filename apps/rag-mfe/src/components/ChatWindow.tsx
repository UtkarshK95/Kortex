import { useEffect, useRef } from 'react'
import { Message } from '../types/rag'
import MessageBubble from './MessageBubble'

interface ChatWindowProps {
  messages: Message[]
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-8 overflow-y-auto">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-white font-semibold text-lg mb-2">Kortex AI Assistant</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ask me anything about enterprise architecture, cloud migration, digital transformation,
            or AI strategies. I will answer using our knowledge base.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            {[
              { icon: '📚', label: 'Knowledge-grounded' },
              { icon: '🔍', label: 'Source citations' },
              { icon: '⚡', label: 'Streaming responses' },
              { icon: '🎯', label: 'Enterprise focused' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2.5"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-400 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
