import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'
import DocumentReview from './pages/DocumentReview'
import ExportPage from './pages/ExportPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="project/:projectId" element={<ProjectView />} />
        <Route path="project/:projectId/document/:documentId" element={<DocumentReview />} />
        <Route path="project/:projectId/export" element={<ExportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

