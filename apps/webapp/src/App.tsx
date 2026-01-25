import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'
import DocumentReview from './pages/DocumentReview'
import ExportPage from './pages/ExportPage'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuth } from './stores/authStore'

function App() {
  const { initialize, isInitialized } = useAuth()

  // Initialize auth on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  // Show loading while auth initializes
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-osita-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-white flex items-center justify-center">
            <span className="text-osita-900 font-bold text-2xl">O</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-white/60 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Loading OSITA...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="project/:projectId" element={<ProjectView />} />
        <Route path="project/:projectId/document/:documentId" element={<DocumentReview />} />
        <Route path="project/:projectId/export" element={<ExportPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
