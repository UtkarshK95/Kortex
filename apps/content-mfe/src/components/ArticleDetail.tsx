import { SanityArticle } from '../types/sanity'
import { blockToText } from '../lib/blockToText'

interface ArticleDetailProps {
  article: SanityArticle
  onBack: () => void
}

export default function ArticleDetail({
  article,
  onBack,
}: ArticleDetailProps) {
  const bodyText = blockToText(article.body)

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Back link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-gray-500
                     hover:text-gray-300 hover:underline text-sm mb-10
                     transition-colors"
        >
          ← Back to Knowledge Hub
        </button>

        {/* Header */}
        <header className="max-w-3xl flex flex-col gap-5 mb-12">
          <div className="flex items-center gap-3">
            <span
              className="bg-violet-500/20 text-violet-400 text-sm
                         font-extrabold px-2.5 py-1 rounded-full"
            >
              {article.category?.name ?? 'Uncategorized'}
            </span>
            <span className="text-gray-500 text-xs">
              {article.readTime} min read
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed">
            {article.excerpt}
          </p>

          <div
            className="flex items-center gap-2 pb-8"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-violet-400 text-sm font-bold">
              {article.author}
            </span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-500 text-xs">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="max-w-3xl flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full
                           bg-gray-800 text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="max-w-3xl space-y-6">
          {bodyText.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-300 text-base leading-7"
            >
              {paragraph.trim()}
            </p>
          ))}
        </div>

      </div>
    </div>
  )
}
