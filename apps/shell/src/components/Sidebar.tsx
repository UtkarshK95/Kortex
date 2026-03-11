import { Link, useLocation } from 'react-router-dom'
import { useKortexStore } from '../store/useKortexStore'

const navItems = [
  {
    label: 'Knowledge Hub',
    href: '/knowledge',
    icon: '📚',
    description: 'Browse articles & services',
  },
  {
    label: 'AI Assistant',
    href: '/assistant',
    icon: '🤖',
    description: 'Ask questions, get answers',
  },
]

export default function Sidebar() {
  const { sidebarOpen } = useKortexStore()
  const location = useLocation()

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64
                      bg-gray-950 border-r border-gray-800
                      overflow-y-auto z-40">
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase
                      tracking-wider font-medium mb-4">
          Navigation
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-start gap-3 px-3
                            py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* MFE Architecture indicator */}
        <div className="mt-8 p-3 bg-gray-900 rounded-lg
                        border border-gray-800">
          <p className="text-xs text-gray-500 font-medium mb-2">
            MFE Status
          </p>
          {[
            { name: 'Shell', port: '3000', active: true },
            { name: 'Content MFE', port: '3001', active: false },
            { name: 'RAG MFE', port: '3002', active: false },
          ].map((mfe) => (
            <div key={mfe.name}
                 className="flex items-center justify-between
                            py-1">
              <span className="text-xs text-gray-400">
                {mfe.name}
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  mfe.active
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`} />
                <span className="text-xs text-gray-600">
                  :{mfe.port}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
