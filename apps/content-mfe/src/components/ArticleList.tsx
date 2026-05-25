import ArticleCard from './ArticleCard'
import { SanityArticle } from '../types/sanity'
import { useUploadedDocs, UploadedDoc } from '../hooks/useUploadedDocs'
import { useState } from 'react'

interface ArticleListProps {
  articles: SanityArticle[]
  onSelectArticle: (slug: string) => void
  onSelectUploadedDoc: (slug: string) => void
}

function toArticleCardShape(doc: UploadedDoc): SanityArticle {
  const slug = doc.title.toLowerCase().replace(/\s+/g, '-')
  const categorySlug = doc.category.toLowerCase().replace(/\s+/g, '-')
  return {
    _id: `uploaded-${slug}`,
    _createdAt: doc.uploaded_at || new Date().toISOString(),
    title: doc.title,
    slug: { current: slug },
    excerpt: doc.excerpt,
    body: [],
    category: {
      _id: categorySlug,
      name: doc.category,
      slug: { current: categorySlug },
    },
    tags: [],
    author: doc.author || 'Manual Upload',
    readTime: 1,
    publishedAt: doc.uploaded_at || new Date().toISOString(),
  }
}

export default function ArticleList({
  articles,
  onSelectArticle,
  onSelectUploadedDoc,
}: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const { docs: uploadedDocs } = useUploadedDocs()

  const allCategories = [
    'All',
    ...new Set([
      ...articles.map((a) => a.category?.name?.trim()).filter(Boolean) as string[],
      ...uploadedDocs.map((d) => d.category?.trim()).filter(Boolean) as string[],
    ]),
  ]

  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category?.name?.trim() === activeCategory)

  const filteredUploads =
    activeCategory === 'All'
      ? uploadedDocs
      : uploadedDocs.filter((d) => d.category?.trim() === activeCategory)

  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          <span
            className="bg-linear-to-r from-blue-400 to-violet-500
                           bg-clip-text text-transparent"
          >
            Knowledge Hub
          </span>
        </h1>
        <p className="text-gray-500 text-base">
          Browse articles, case studies, and service offerings
        </p>
        <div
          className="mt-6 h-px"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200 ${
                          activeCategory === cat
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sanity articles grid */}
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
          <p className="text-gray-500">No articles in this category.</p>
        </div>
      )}

      {/* Uploaded Documents */}
      {filteredUploads.length > 0 && (
        <div style={{ marginTop: '64px' }}>
          <div
            className="mb-px h-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          />
          <div className="mt-10 mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              <span className="bg-linear-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                Uploaded Documents
              </span>
            </h2>
            <p className="text-gray-500 text-sm">
              Documents added manually via the RAG knowledge ingestion pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUploads.map((doc) => {
              const slug = doc.title.toLowerCase().replace(/\s+/g, '-')
              return (
                <ArticleCard
                  key={doc.title}
                  article={toArticleCardShape(doc)}
                  onSelect={() => onSelectUploadedDoc(slug)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
