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
      </div>
    </aside>
  )
}
