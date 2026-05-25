import { useState, useEffect } from 'react'

export interface UploadedDoc {
  title: string
  category: string
  author: string
  excerpt: string
  content: string
  source: string
  uploaded_at: string
}

const RAG_SERVICE_URL = import.meta.env.VITE_RAG_SERVICE_URL ?? 'http://localhost:8000'

export function useUploadedDocs() {
  const [docs, setDocs] = useState<UploadedDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${RAG_SERVICE_URL}/documents`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<UploadedDoc[]>
      })
      .then(setDocs)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch'))
      .finally(() => setLoading(false))
  }, [])

  return { docs, loading, error }
}
