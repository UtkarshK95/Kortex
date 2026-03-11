import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'
import { articlesQuery, categoriesQuery } from '../lib/queries'
import { SanityArticle, SanityCategory } from '../types/sanity'

interface UseSanityArticlesResult {
  articles: SanityArticle[]
  categories: SanityCategory[]
  loading: boolean
  error: string | null
}

export function useSanityArticles(): UseSanityArticlesResult {
  const [articles, setArticles] = useState<SanityArticle[]>([])
  const [categories, setCategories] = useState<SanityCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const [fetchedArticles, fetchedCategories] =
          await Promise.all([
            sanityClient.fetch<SanityArticle[]>(articlesQuery),
            sanityClient.fetch<SanityCategory[]>(categoriesQuery),
          ])

        setArticles(fetchedArticles)
        setCategories(fetchedCategories)
      } catch (err) {
        console.error('Failed to fetch from Sanity:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch content'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { articles, categories, loading, error }
}
