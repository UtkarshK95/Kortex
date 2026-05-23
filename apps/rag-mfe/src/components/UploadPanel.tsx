import { useState, useRef } from 'react'

interface UploadPanelProps {
  onClose: () => void
  onSuccess: (title: string) => void
}

const RAG_SERVICE_URL =
  import.meta.env.VITE_RAG_SERVICE_URL ??
  'http://localhost:8000'

type UploadMode = 'paste' | 'file'
type UploadStatus = 'idle' | 'loading' | 'success' | 'error'

export default function UploadPanel({
  onClose,
  onSuccess,
}: UploadPanelProps) {
  const [mode, setMode] = useState<UploadMode>('paste')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [message, setMessage] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ')
          fullText += pageText + '\n\n'
        }
        setContent(fullText.trim())
      } catch (err) {
        setStatus('error')
        setMessage('Failed to extract PDF text. Try a text file instead.')
        return
      }
    } else {
      const text = await file.text()
      setContent(text)
    }

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(
        `${RAG_SERVICE_URL}/ingest/document`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            category: category.trim() || 'User Upload',
            author: 'Manual Upload',
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail ?? 'Ingestion failed')
      }

      setStatus('success')
      setMessage(data.message)
      setTimeout(() => {
        onSuccess(title.trim())
        onClose()
      }, 1500)
    } catch (err) {
      setStatus('error')
      setMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    }
  }

  const canSubmit =
    title.trim() &&
    content.trim() &&
    status !== 'loading'

  const inputClass =
    'w-full text-white text-sm rounded-xl px-3 py-2 outline-none ' +
    'placeholder-gray-500 transition-colors focus:border-violet-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md mx-4 rounded-2xl p-6 flex flex-col gap-5"
        style={{
          backgroundColor: '#0f0f1a',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">
            Upload Knowledge
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors
                       text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg"
             style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {(['paste', 'file'] as UploadMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-medium
                          transition-colors ${
                mode === m
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 'paste' ? 'Paste Text' : 'Upload File'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400 font-medium">
            Document Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Strategy Document"
            className={inputClass}
            style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400 font-medium">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. HR Policy, Strategy, Finance"
            className={inputClass}
            style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
        </div>

        {/* Content — paste or file */}
        {mode === 'paste' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your document content here..."
              style={{
                resize: 'none',
                minHeight: '8rem',
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
              className={inputClass + ' overflow-y-auto'}
            />
            {content && (
              <p className="text-xs text-gray-600">
                {content.split(/\s+/).filter(Boolean).length} words
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 font-medium">
              File (.txt, .md, or .pdf) *
            </label>
            {uploadedFile ? (
              <div
                className="w-full rounded-xl px-4 py-3 flex items-center
                           justify-between"
                style={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-green-400 text-sm shrink-0">✅</span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {content.split(/\s+/).filter(Boolean).length} words extracted
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null)
                    setContent('')
                    if (fileRef.current) fileRef.current.value = ''
                  }}
                  className="text-gray-500 hover:text-red-400 text-xs
                             transition-colors ml-3 shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl px-3 py-8 text-center
                           cursor-pointer transition-colors
                           hover:border-violet-500/50"
                style={{
                  backgroundColor: '#1a1a2e',
                  border: '2px dashed rgba(255,255,255,0.10)',
                }}
              >
                <p className="text-gray-400 text-sm mb-1">
                  Click to select a file
                </p>
                <p className="text-gray-600 text-xs">
                  Supported: .txt, .md, .pdf
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Status message */}
        {message && (
          <div
            className={`text-sm px-3 py-2 rounded-xl ${
              status === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {message}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm
                       transition-colors px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-violet-600 hover:bg-violet-500
                       disabled:bg-gray-700 disabled:cursor-not-allowed
                       text-white text-sm font-semibold rounded-xl
                       px-4 py-2 transition-colors flex items-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30
                                border-t-white rounded-full animate-spin" />
                Ingesting...
              </>
            ) : (
              'Ingest into RAG'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
