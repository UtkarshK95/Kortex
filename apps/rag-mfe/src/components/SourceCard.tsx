import { useState } from 'react'
import { X } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const bodyText = source.content || source.excerpt || ''
  const colorClass =
    categoryColors[source.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'

  return (
    <>
      <style>{`
        .source-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139,92,246,0.3) transparent;
        }
        .source-modal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .source-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .source-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.3);
          border-radius: 2px;
        }
      `}</style>

      {/* Card */}
      <div
        className="bg-gray-900 rounded-lg"
        style={{
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          minWidth: '280px',
          maxWidth: '320px',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
        onClick={() => setOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
          e.currentTarget.style.backgroundColor = '#1a1a2e'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.backgroundColor = ''
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <p className="text-white text-xs font-medium leading-snug" style={{ flex: 1 }}>
            {source.title}
          </p>
          <span
            className={`text-xs rounded-full border font-medium ${colorClass}`}
            style={{ flexShrink: 0, padding: '2px 8px', whiteSpace: 'nowrap' }}
          >
            {source.category}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
          {source.author}
        </p>
      </div>

      {/* Modal */}
      {open && (
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
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0f0f1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              maxWidth: '480px',
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
                onClick={() => setOpen(false)}
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
                }}
              >
                <X size={16} />
              </button>

              {/* Title + category */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingRight: '28px' }}>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '1.4',
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {source.title}
                </h3>
                <span
                  className={`text-xs rounded-full border font-medium ${colorClass}`}
                  style={{ flexShrink: 0, padding: '3px 10px', whiteSpace: 'nowrap' }}
                >
                  {source.category}
                </span>
              </div>

              {/* Author */}
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)',
                  margin: '10px 0 16px',
                }}
              >
                {source.author}
              </p>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />
            </div>

            {/* Scrollable body */}
            <div
              className="source-modal-scroll"
              style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: '300px',
                padding: '0 24px 24px 24px',
                paddingRight: '4px',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  margin: 0,
                }}
              >
                {bodyText}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
