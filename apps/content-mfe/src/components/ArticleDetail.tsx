import { Article } from '../data/articles'

interface ArticleDetailProps {
  article: Article
  onBack: () => void
}

export default function ArticleDetail({
  article,
  onBack,
}: ArticleDetailProps) {
  return (
    <article className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-400
                   hover:text-white text-sm mb-8 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Knowledge Hub
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs px-2.5 py-1 rounded-full
                       bg-indigo-500/10 text-indigo-400
                       border border-indigo-500/20 font-medium"
          >
            {article.category.replace(/-/g, ' ')}
          </span>
          <span className="text-gray-500 text-xs">
            {article.readTime} min read
          </span>
        </div>

        <h1
          className="text-3xl font-bold text-white mb-4
                     leading-tight"
        >
          {article.title}
        </h1>

        <p
          className="text-gray-400 text-lg leading-relaxed mb-6"
        >
          {article.excerpt}
        </p>

        <div
          className="flex items-center gap-4 pb-6
                     border-b border-gray-800"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-indigo-600
                         flex items-center justify-center"
            >
              <span className="text-white text-sm">
                {article.author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {article.author}
              </p>
              <p className="text-gray-500 text-xs">
                {new Date(article.publishedAt).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full
                       bg-gray-800 text-gray-400 border
                       border-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {article.body.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-300 leading-relaxed"
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </article>
  )
}
