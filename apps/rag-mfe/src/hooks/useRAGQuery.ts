import { useState, useCallback } from 'react'
import { Message, Source } from '../types/rag'

const RAG_SERVICE_URL = import.meta.env.VITE_RAG_SERVICE_URL ?? 'http://localhost:8000'

export function useRAGQuery() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini')

  const sendQuery = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        sources: [],
        isStreaming: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setIsLoading(true)

      try {
        const response = await fetch(`${RAG_SERVICE_URL}/query/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ question, top_k: 5, stream: true, provider }),
        })

        if (!response.ok) {
          throw new Error(`RAG service error: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        let buffer = ''
        let sources: Source[] = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('event: ')) continue
            if (!line.startsWith('data: ')) continue

            const dataStr = line.slice(6).trim()
            if (!dataStr) continue

            try {
              const data = JSON.parse(dataStr)

              if (data.text !== undefined) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: msg.content + data.text }
                      : msg
                  )
                )
              }

              if (data.sources) {
                sources = data.sources
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id ? { ...msg, sources } : msg
                  )
                )
              }

              if (data.status === 'complete') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                )
              }

              if (data.error) throw new Error(data.error)
            } catch {
              // skip malformed SSE lines
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, isStreaming: false, sources }
              : msg
          )
        )
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content:
                    error instanceof Error
                      ? `Error: ${error.message}`
                      : 'Something went wrong. Please try again.',
                  isStreaming: false,
                }
              : msg
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, provider]
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isLoading, sendQuery, clearMessages, provider, setProvider }
}
