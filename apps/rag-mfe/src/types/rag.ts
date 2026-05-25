export interface Source {
  title: string
  slug: string
  category: string
  author: string
  excerpt: string
  content?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
  timestamp: Date
}

export interface QueryStreamEvent {
  type: 'chunk' | 'sources' | 'done' | 'error'
  text?: string
  sources?: Source[]
  error?: string
}
