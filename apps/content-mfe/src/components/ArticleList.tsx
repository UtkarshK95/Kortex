import { useState } from 'react'
import ArticleCard from './ArticleCard'
import { SanityArticle, SanityCategory } from '../types/sanity'

interface ArticleListProps {
  articles: SanityArticle[]
  categories: SanityCategory[]
  onSelectArticle: (slug: string) => void
}

export default function ArticleList({
  articles,
  categories,
  onSelectArticle,
}: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const allCategory: SanityCategory = {
    _id: 'all',
    name: 'All',
    slug: { current: 'all' },
  }

  const allCategories = [allCategory, ...categories]

  const filtered =
    activeCategory === 'all'
      ? articles
      : articles.filter(
          (a) => a.category?.slug?.current === activeCategory
        )

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat.slug.current)}
            className={`px-4 py-2 rounded-lg text-sm
                       font-medium transition-colors ${
              activeCategory === cat.slug.current
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No articles in this category.
          </p>
        </div>
      )}
    </div>
  )
}
