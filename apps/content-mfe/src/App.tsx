import { useState } from 'react'
import ArticleList from './components/ArticleList'
import ArticleDetail from './components/ArticleDetail'
import { articles } from './data/articles'

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const selectedArticle = selectedSlug
    ? articles.find((a) => a.slug === selectedSlug) ?? null
    : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {selectedArticle ? (
        <div className="p-8">
          <ArticleDetail
            article={selectedArticle}
            onBack={() => setSelectedSlug(null)}
          />
        </div>
      ) : (
        <div className="p-8">
          <ArticleList onSelectArticle={setSelectedSlug} />
        </div>
      )}
    </div>
  )
}
