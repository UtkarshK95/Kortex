import ReactMarkdown from 'react-markdown'
import { Bookmark } from 'lucide-react'
import { Message } from '../types/rag'
import SourceCard from './SourceCard'

interface MessageBubbleProps {
  message: Message
}

const STRIP_PATTERNS =
  /^(based on|this information is based|this is based|source:|this answer is based)/i

function stripBasedOnLine(content: string): string {
  return content
    .split('\n')
    .filter((line) => !STRIP_PATTERNS.test(line.replace(/\*\*/g, '').trim()))
    .join('\n')
    .trim()
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const displayContent = isUser
    ? message.content
    : stripBasedOnLine(message.content)

  return (
    <>
      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .rag-sources-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .rag-sources-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .rag-sources-scroll::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.3);
          border-radius: 2px;
        }
      `}</style>

      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-medium ${
            isUser ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          {isUser ? 'U' : '🤖'}
        </div>

        {/* Content */}
        <div
          className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-gray-800 text-gray-200 rounded-tl-sm'
            }`}
          >
            {/* Pulsating loader while waiting for first token */}
            {!isUser && message.isStreaming && !message.content && (
              <p
                style={{
                  // color: 'rgba(167, 139, 250, 0.8)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  animation: 'loadingPulse 1.5s ease-in-out infinite',
                  margin: 0,
                }}
              >
                Loading...
              </p>
            )}

            {/* Message content */}
            {isUser ? (
              <p>{displayContent}</p>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:text-white prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-strong:text-white prose-ul:my-1 prose-ul:pl-4 prose-ol:my-1 prose-ol:pl-4 prose-li:my-0.5 prose-code:text-indigo-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded">
                <ReactMarkdown>{displayContent}</ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>

          {/* Sources */}
          {!isUser &&
            !message.isStreaming &&
            message.sources &&
            message.sources.length > 0 && (
              <div className="w-full">
                {/* Divider + label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    }}
                  />
                  <Bookmark
                    size={10}
                    style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
                  />
                  <span
                    className="uppercase tracking-wider"
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    Sources
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    }}
                  />
                </div>

                {/* Cards — horizontal scroll when multiple */}
                <div
                  className="rag-sources-scroll"
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'visible',
                    gap: '12px',
                    paddingBottom: '16px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(139,92,246,0.3) transparent',
                  }}
                >
                  {message.sources.map((source) => (
                    <SourceCard key={source.slug} source={source} />
                  ))}
                </div>
              </div>
            )}

          {/* Timestamp */}
          <span className="text-xs text-gray-600 px-1">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </>
  )
}
