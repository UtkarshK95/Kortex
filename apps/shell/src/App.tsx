import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import KnowledgePage from './pages/KnowledgePage'
import AssistantPage from './pages/AssistantPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  if (!isSignedIn) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/knowledge/*"
                   element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
            <Route path="/assistant/*"
                   element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
