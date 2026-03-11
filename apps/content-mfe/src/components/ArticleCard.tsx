import { Article } from '../data/articles'

interface ArticleCardProps {
  article: Article
  onSelect: (slug: string) => void
}

const categoryColors: Record<string, string> = {
  cloud:
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'digital-transformation':
    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'ai-data':
    'bg-green-500/10 text-green-400 border-green-500/20',
}

export default function ArticleCard({
  article,
  onSelect,
}: ArticleCardProps) {
  const colorClass =
    categoryColors[article.category] ||
    'bg-gray-500/10 text-gray-400 border-gray-500/20'

  return (
    <article
      onClick={() => onSelect(article.slug)}
      className="bg-gray-900 border border-gray-800 rounded-xl
                 p-6 hover:border-indigo-500/50 transition-all
                 duration-200 cursor-pointer group h-full
                 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs px-2.5 py-1 rounded-full
                     border font-medium ${colorClass}`}
        >
          {article.category.replace(/-/g, ' ')}
        </span>
        <span className="text-gray-500 text-xs">
          {article.readTime} min read
        </span>
      </div>

      <h2
        className="text-white font-semibold text-lg mb-3
                   group-hover:text-indigo-300 transition-colors
                   line-clamp-2 flex-1"
      >
        {article.title}
      </h2>

      <p
        className="text-gray-400 text-sm leading-relaxed
                   line-clamp-3 mb-4"
      >
        {article.excerpt}
      </p>

      <div
        className="flex items-center justify-between pt-4
                   border-t border-gray-800"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-indigo-600
                       flex items-center justify-center"
          >
            <span className="text-white text-xs">
              {article.author.charAt(0)}
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            {article.author}
          </span>
        </div>
        <span className="text-gray-500 text-xs">
          {new Date(article.publishedAt).toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric', year: 'numeric' }
          )}
        </span>
      </div>
    </article>
  )
}
