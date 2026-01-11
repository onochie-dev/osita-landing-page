import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'
import DocumentReview from './pages/DocumentReview'
import ExportPage from './pages/ExportPage'
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading OSITA...</p>
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
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
