import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import KnowledgePage from './pages/KnowledgePage'
import AssistantPage from './pages/AssistantPage'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/knowledge/*"
                   element={<KnowledgePage />} />
            <Route path="/assistant/*"
                   element={<AssistantPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
