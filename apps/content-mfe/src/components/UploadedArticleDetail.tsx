import { useUploadedDocs } from '../hooks/useUploadedDocs'

function cleanMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/^\*\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

interface UploadedArticleDetailProps {
  slug: string
  onBack: () => void
}

export default function UploadedArticleDetail({ slug, onBack }: UploadedArticleDetailProps) {
  const { docs, loading } = useUploadedDocs()

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    )
  }

  const doc = docs.find(
    (d) => d.title.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (!doc) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-gray-500 text-sm">Document not found.</div>
      </div>
    )
  }

  const displayTitle = doc.title
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const sentences = cleanMarkdown(doc.content || '')
    .split('. ')
    .map((s) => s.trim())
    .filter(Boolean)
  const paragraphs: string[] = []
  for (let i = 0; i < sentences.length; i += 3) {
    const chunk = sentences.slice(i, i + 3).join('. ')
    paragraphs.push(chunk.endsWith('.') ? chunk : chunk + '.')
  }

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-4xl mx-auto px-8" style={{ paddingTop: '48px', paddingBottom: '32px' }}>

        {/* Back link */}
        <button
          onClick={onBack}
          className="back-btn inline-flex items-center gap-1.5 text-gray-500 text-sm transition-colors"
          style={{ cursor: 'pointer', marginBottom: '24px' }}
        >
          ← Back to Knowledge Hub
        </button>

        {/* Header */}
        <header className="max-w-3xl flex flex-col gap-5" style={{ marginBottom: '24px' }}>
          <div className="flex items-center gap-3">
            <span className="bg-violet-500/20 text-violet-400 text-sm font-extrabold px-2.5 py-1 rounded-full">
              {doc.category}
            </span>
            <span className="text-gray-500 text-xs">1 min read</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            {displayTitle}
          </h1>

          <div
            className="flex items-center gap-2 pb-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-violet-400 text-sm font-bold">
              {doc.author || 'Manual Upload'}
            </span>
            {doc.uploaded_at && (
              <>
                <span className="text-gray-600 text-xs">·</span>
                <span className="text-gray-500 text-xs">
                  {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Manual Upload badge */}
        <div className="max-w-3xl flex flex-wrap gap-2" style={{ marginBottom: '24px' }}>
          <span
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.45)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Manual Upload
          </span>
        </div>

        {/* Body */}
        <div className="max-w-3xl">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-gray-300 text-base leading-7"
                style={{ marginBottom: '16px' }}
              >
                {para}
              </p>
            ))
          ) : (
            <p className="text-gray-500 text-base leading-7">No content available.</p>
          )}
        </div>

      </div>
    </div>
  )
}
