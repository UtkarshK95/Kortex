import { useState } from 'react'
import ArticleList from './components/ArticleList'
import ArticleDetail from './components/ArticleDetail'
import UploadedArticleDetail from './components/UploadedArticleDetail'
import { useSanityArticles } from './hooks/useSanityArticles'
import { SanityArticle } from './types/sanity'

function LoadingState() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800
                       rounded-xl p-6 animate-pulse"
          >
            <div className="h-3 bg-gray-800 rounded mb-4 w-20" />
            <div className="h-5 bg-gray-800 rounded mb-3" />
            <div className="h-3 bg-gray-800 rounded mb-2" />
            <div className="h-3 bg-gray-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="bg-gray-900 border border-red-500/20
                      rounded-xl p-8 text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-white font-semibold mb-2">
          Failed to load content
        </h3>
        <p className="text-gray-400 text-sm mb-2">
          Could not fetch articles from Sanity CMS.
        </p>
        <p className="text-gray-600 text-xs font-mono">
          {message}
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const { articles, categories, loading, error } = useSanityArticles()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [selectedUploadedSlug, setSelectedUploadedSlug] = useState<string | null>(null)

  const selectedArticle: SanityArticle | null = selectedSlug
    ? articles.find((a) => a.slug.current === selectedSlug) ?? null
    : null

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedSlug(null)}
        />
      ) : selectedUploadedSlug ? (
        <UploadedArticleDetail
          slug={selectedUploadedSlug}
          onBack={() => setSelectedUploadedSlug(null)}
        />
      ) : (
        <ArticleList
          articles={articles}
          categories={categories}
          onSelectArticle={setSelectedSlug}
          onSelectUploadedDoc={setSelectedUploadedSlug}
        />
      )}
    </div>
  )
}
