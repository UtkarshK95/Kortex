import { useState } from 'react'
import ArticleCard from './ArticleCard'
import { articles, categories } from '../data/articles'

interface ArticleListProps {
  onSelectArticle: (slug: string) => void
}

export default function ArticleList({
  onSelectArticle,
}: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-lg text-sm
                       font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat.name}
            <span className="ml-2 text-xs opacity-60">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onSelect={onSelectArticle}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No articles in this category.
          </p>
        </div>
      )}
    </div>
  )
}
