import { Link, useLocation } from 'react-router-dom'
import { Show, SignInButton, UserButton } from '@clerk/react'
import { BookOpen, Bot } from 'lucide-react'

const navLinks = [
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'AI Assistant', href: '/assistant' },
]

const bottomNavItems = [
  { label: 'Knowledge', href: '/knowledge', Icon: BookOpen },
  { label: 'Assistant', href: '/assistant', Icon: Bot },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16
                      bg-gray-950 border-b border-gray-800
                      flex items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
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

        {/* Center — desktop only */}
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
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700
                           text-white text-sm font-medium rounded-lg
                           transition-colors"
              >
                Sign In
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </Show>
        </div>
      </nav>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50
                      bg-gray-950 border-t border-gray-800
                      flex md:hidden">
        {bottomNavItems.map(({ label, href, Icon }) => {
          const isActive = location.pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-1 flex-col items-center justify-center
                          py-3 gap-1 transition-colors ${
                isActive
                  ? 'text-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
