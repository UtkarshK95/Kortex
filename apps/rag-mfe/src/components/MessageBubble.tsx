import ReactMarkdown from 'react-markdown'
import { Message } from '../types/rag'
import SourceCard from './SourceCard'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
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
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-sm'
              : 'bg-gray-800 text-gray-200 rounded-tl-sm'
          }`}
        >
          {/* Streaming dots */}
          {message.isStreaming && !message.content && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}

          {/* Message content */}
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:text-white prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-strong:text-white prose-ul:my-1 prose-ul:pl-4 prose-ol:my-1 prose-ol:pl-4 prose-li:my-0.5 prose-code:text-indigo-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && !message.isStreaming && message.sources && message.sources.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-2 px-1">Sources</p>
            <div className="flex flex-col gap-2">
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
  )
}
