import { useState } from 'react'
import ArticleCard from './ArticleCard'
import { SanityArticle, SanityCategory } from '../types/sanity'
import { useUploadedDocs, UploadedDoc } from '../hooks/useUploadedDocs'

interface ArticleListProps {
  articles: SanityArticle[]
  categories: SanityCategory[]
  onSelectArticle: (slug: string) => void
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
  categories,
  onSelectArticle,
}: ArticleListProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const { docs: uploadedDocs } = useUploadedDocs()
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(null)

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
    <div className="px-8 py-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          <span className="bg-linear-to-r from-blue-400 to-violet-500
                           bg-clip-text text-transparent">
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
            key={cat._id}
            onClick={() => setActiveCategory(cat.slug.current)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200 ${
              activeCategory === cat.slug.current
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat.name}
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
      {uploadedDocs.length > 0 && (
        <div className="mt-16">
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
            {uploadedDocs.map((doc) => (
              <ArticleCard
                key={doc.title}
                article={toArticleCardShape(doc)}
                onSelect={() => setSelectedDoc(doc)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Uploaded doc detail modal */}
      {selectedDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px',
          }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#0f0f1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              position: 'relative',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed header */}
            <div style={{ padding: '24px 24px 0 24px', flexShrink: 0 }}>
              {/* Close */}
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>

              {/* Category pill + Manual Upload badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(139,92,246,0.15)',
                    color: '#a78bfa',
                  }}
                >
                  {selectedDoc.category}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  Manual Upload
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: '1.4',
                  margin: '0 0 8px 0',
                  paddingRight: '28px',
                }}
              >
                {selectedDoc.title}
              </h2>

              {/* Author + date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>
                  {selectedDoc.author || 'Manual Upload'}
                </span>
                {selectedDoc.uploaded_at && (
                  <>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>·</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(selectedDoc.uploaded_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />
            </div>

            {/* Scrollable body */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '0 24px 24px 24px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(139,92,246,0.3) transparent',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedDoc.excerpt || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
