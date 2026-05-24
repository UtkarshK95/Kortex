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
  const [errorMessage, setErrorMessage] = useState('')
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
        setErrorMessage('Failed to extract PDF text. Try a text file instead.')
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
    setErrorMessage('')

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
      setTimeout(() => {
        onSuccess(title.trim())
        onClose()
      }, 1500)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    }
  }

  const canSubmit =
    title.trim() &&
    content.trim() &&
    status !== 'loading' &&
    status !== 'success'

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '0.75rem',
    padding: '8px 12px',
    fontSize: '0.875rem',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const inputFocusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
    },
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#0f0f1a',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '480px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Add Knowledge</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors
                       text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Segmented tab control */}
        <div
          style={{
            display: 'flex',
            padding: '4px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        >
          {(['paste', 'file'] as UploadMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                backgroundColor: mode === m ? '#7c3aed' : 'transparent',
                color: mode === m ? 'white' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              {m === 'paste' ? 'Paste Text' : 'Upload File'}
            </button>
          ))}
        </div>

        {/* Document Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Document Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Strategy Document"
            style={{ ...inputStyle }}
            {...inputFocusHandlers}
          />
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. HR Policy, Strategy, Finance"
            style={{ ...inputStyle }}
            {...inputFocusHandlers}
          />
        </div>

        {/* Content — paste or file */}
        {mode === 'paste' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your document content here..."
              style={{
                ...inputStyle,
                resize: 'none',
                minHeight: '8rem',
                overflowY: 'auto',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
            {content && (
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                {content.split(/\s+/).filter(Boolean).length} words
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>File (.txt, .md, or .pdf) *</label>
            {uploadedFile ? (
              <div
                style={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '0.75rem',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                style={{
                  backgroundColor: '#1a1a2e',
                  border: '2px dashed rgba(255,255,255,0.10)',
                  borderRadius: '0.75rem',
                  padding: '32px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                }}
              >
                <p className="text-gray-400 text-sm mb-1">Click to select a file</p>
                <p className="text-gray-600 text-xs">Supported: .txt, .md, .pdf</p>
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm transition-colors px-4 py-2 rounded-lg
                       hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="text-white text-sm font-semibold rounded-xl
                         px-4 py-2 transition-colors flex items-center gap-2
                         disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  status === 'success' ? '#16a34a'
                  : !canSubmit ? '#374151'
                  : '#7c3aed',
              }}
              onMouseEnter={(e) => {
                if (canSubmit && status !== 'success')
                  e.currentTarget.style.backgroundColor = '#6d28d9'
              }}
              onMouseLeave={(e) => {
                if (status === 'success')
                  e.currentTarget.style.backgroundColor = '#16a34a'
                else if (canSubmit)
                  e.currentTarget.style.backgroundColor = '#7c3aed'
              }}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30
                                  border-t-white rounded-full animate-spin" />
                  Ingesting...
                </>
              ) : status === 'success' ? (
                '✓ Uploaded!'
              ) : (
                'Submit'
              )}
            </button>

            {status === 'error' && errorMessage && (
              <p style={{ fontSize: '0.75rem', color: '#f87171' }}>
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
