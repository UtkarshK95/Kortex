import { Source } from '../types/rag'

interface SourceCardProps {
  source: Source
}

const categoryColors: Record<string, string> = {
  Cloud: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Digital Transformation': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'AI & Data': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Enterprise Architecture': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

export default function SourceCard({ source }: SourceCardProps) {
  const colorClass =
    categoryColors[source.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-white text-xs font-medium leading-snug flex-1">{source.title}</p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${colorClass}`}
        >
          {source.category}
        </span>
      </div>
      <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{source.excerpt}</p>
      <p className="text-gray-600 text-xs mt-1.5">{source.author}</p>
    </div>
  )
}
