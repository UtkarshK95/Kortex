import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

interface KortexStore {
  // Auth
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
  // RAG
  lastQuery: string
  setLastQuery: (query: string) => void
}

export const useKortexStore = create<KortexStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),
  sidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  lastQuery: '',
  setLastQuery: (query) => set({ lastQuery: query }),
}))
