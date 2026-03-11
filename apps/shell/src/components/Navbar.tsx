import { Link, useLocation } from 'react-router-dom'
import { useKortexStore } from '../store/useKortexStore'

const navLinks = [
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'AI Assistant', href: '/assistant' },
]

export default function Navbar() {
  const { toggleSidebar, isAuthenticated, user } = useKortexStore()
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16
                    bg-gray-950 border-b border-gray-800
                    flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl
                           tracking-tight">
            Kortex
          </span>
          <span className="text-gray-500 text-xs mt-0.5 hidden
                           sm:block">
            Knowledge Portal
          </span>
        </Link>
      </div>

      {/* Center */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`px-4 py-2 rounded-lg text-sm
                       transition-colors ${
              location.pathname.startsWith(link.href)
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600
                            flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-300 text-sm hidden sm:block">
              {user?.name}
            </span>
          </div>
        ) : (
          <button
            onClick={() =>
              useKortexStore.getState().setUser({
                id: '1',
                name: 'Utkarsh Katiyar',
                email: 'utkarsh@kortex.dev',
                role: 'admin',
              })
            }
            className="bg-indigo-600 hover:bg-indigo-700
                       text-white text-sm px-4 py-2 rounded-lg
                       transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}
