import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useKortexStore } from './store/useKortexStore'
import HomePage from './pages/HomePage'
import KnowledgePage from './pages/KnowledgePage'
import AssistantPage from './pages/AssistantPage'

export default function App() {
  const { sidebarOpen } = useKortexStore()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Sidebar />
        <main
          className={`pt-16 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
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
