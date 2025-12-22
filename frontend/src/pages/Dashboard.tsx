import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  FileText,
  Trash2,
  Loader2,
  Zap,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsApi } from '../api/projects'
import StatusBadge from '../components/StatusBadge'
import type { ProjectCreate, ReportingPeriod } from '../types'

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  })

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted')
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-midnight-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your CBAM filing projects
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-osita-500" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-5 hover:border-white/10 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-osita-500/20 to-osita-600/20 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-osita-400" />
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-osita-400 transition-colors">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {project.reporting_period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.reporting_period} {project.reporting_year}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {project.document_count} docs
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(project.id, project.name)
                        }}
                        className="p-1.5 rounded-lg hover:bg-coral-500/10 text-gray-400 hover:text-coral-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState onCreateClick={() => setShowCreateModal(true)} />
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-osita-500/20 to-osita-600/20 flex items-center justify-center">
        <Zap className="w-10 h-10 text-osita-500" />
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-2">
        Welcome to Osita
      </h2>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        Start by creating your first CBAM filing project. Upload energy bills, 
        review extracted data, and export to Excel or XML.
      </p>
      
      <button onClick={onCreateClick} className="btn btn-primary">
        <Plus className="w-4 h-4" />
        Create Your First Project
      </button>
    </motion.div>
  )
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ProjectCreate>({
    name: '',
    description: '',
    reporting_period: undefined,
    reporting_year: new Date().getFullYear().toString(),
    emission_factor_source: 'commission_default',
  })

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created!')
      onClose()
      navigate(`/project/${project.id}`)
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a project name')
      return
    }
    createMutation.mutate(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q1 2024 CBAM Report"
              className="w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
              rows={2}
              className="w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reporting Period
              </label>
              <select
                value={formData.reporting_period || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  reporting_period: e.target.value as ReportingPeriod || undefined 
                })}
                className="w-full"
              >
                <option value="">Select...</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Year
              </label>
              <input
                type="text"
                value={formData.reporting_year || ''}
                onChange={(e) => setFormData({ ...formData, reporting_year: e.target.value })}
                placeholder="2024"
                pattern="\d{4}"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Emission Factor Source
            </label>
            <select
              value={formData.emission_factor_source}
              onChange={(e) => setFormData({ ...formData, emission_factor_source: e.target.value })}
              className="w-full"
            >
              <option value="commission_default">Commission Default Values</option>
              <option value="provided">Custom / Provided Value</option>
            </select>
          </div>

          {formData.emission_factor_source === 'provided' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Emission Factor (tCO₂/MWh)
              </label>
              <input
                type="text"
                value={formData.emission_factor_value || ''}
                onChange={(e) => setFormData({ ...formData, emission_factor_value: e.target.value })}
                placeholder="e.g., 0.45"
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

