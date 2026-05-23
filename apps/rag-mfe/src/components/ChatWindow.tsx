import { useEffect, useRef } from 'react'
import { Bot, BookOpen, Quote, Zap, Building2 } from 'lucide-react'
import { Message } from '../types/rag'
import MessageBubble from './MessageBubble'

interface ChatWindowProps {
  messages: Message[]
}

const FEATURES = [
  {
    Icon: BookOpen,
    label: 'Knowledge-grounded',
    desc: 'Answers sourced from your content',
  },
  {
    Icon: Quote,
    label: 'Source citations',
    desc: 'Every answer includes article references',
  },
  {
    Icon: Zap,
    label: 'Streaming responses',
    desc: 'Real-time token-by-token generation',
  },
  {
    Icon: Building2,
    label: 'Enterprise focused',
    desc: 'Tuned for org knowledge queries',
  },
]

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center
                      p-8 overflow-y-auto">
        <div className="text-center max-w-lg w-full">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <Bot className="w-12 h-12 text-violet-400" />
          </div>

          {/* Heading */}
          <h3 className="text-white font-bold text-2xl mb-3">
            Kortex AI Assistant
          </h3>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg
                        mx-auto">
            Ask me anything about enterprise architecture, cloud migration,
            digital transformation, or AI strategies. I will answer using
            our knowledge base.
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            {FEATURES.map(({ Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-xl p-4 transition-colors duration-200
                           hover:border-violet-600/40"
                style={{
                  backgroundColor: '#0f0f1a',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon className="w-4 h-4 text-violet-400 mb-2" />
                <p className="text-white text-xs font-bold mb-1">{label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
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
