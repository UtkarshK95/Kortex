import { SanityArticle } from '../types/sanity'

interface ArticleCardProps {
  article: SanityArticle
  onSelect: (slug: string) => void
}

const categoryColors: Record<string, string> = {
  'ai-data': 'bg-violet-500/20 text-violet-400',
  cloud: 'bg-violet-500/20 text-violet-400',
  'digital-transformation': 'bg-violet-500/20 text-violet-400',
  'enterprise-architecture': 'bg-violet-500/20 text-violet-400',
}

export default function ArticleCard({ article, onSelect }: ArticleCardProps) {
  const categorySlug = article.category?.slug?.current ?? ''
  const colorClass =
    categoryColors[categorySlug] || 'bg-violet-500/20 text-violet-400'

  return (
    <article
      className="group rounded-2xl p-6 flex flex-col
                 gap-4 h-full transition-all duration-300 border border-white/8
                 hover:border-violet-600/40 hover:-translate-y-0.5
                 hover:shadow-xl"
      style={{ backgroundColor: '#0f0f1a' }}
    >
      {/* Top row: category badge + read time */}
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-extrabold px-2.5 py-1 rounded-full cursor-pointer ${colorClass}`}
        >
          {article.category?.name ?? 'Uncategorized'}
        </span>
        <span className="text-gray-500 text-xs cursor-pointer">
          {article.readTime} min read
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-white font-bold text-lg leading-snug
                   line-clamp-2 flex-1 cursor-pointer"
      >
        {article.title}
      </h2>

      {/* Description */}
      <p
        className="text-gray-500 text-sm leading-relaxed
                   line-clamp-3 cursor-pointer"
      >
        {article.excerpt}
      </p>

      {/* Footer: author + date + hover CTA */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-xs font-bold cursor-pointer">
            {article.author}
          </span>
          <span className="text-gray-600 text-xs cursor-pointer">·</span>
          <span className="text-gray-600 text-xs cursor-pointer">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <button
          onClick={() => onSelect(article.slug.current)}
          style={{ padding: '8px', cursor: 'pointer' }}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs
                     font-semibold rounded-lg transition-all duration-200
                     opacity-0 group-hover:opacity-100 shrink-0 ml-2"
        >
          Read article →
        </button>
      </div>
    </article>
  )
}
