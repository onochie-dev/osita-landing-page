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
  ArrowRight,
  X
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
    <div className="min-h-full bg-osita-50">
      {/* Header */}
      <header className="bg-white border-b border-osita-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-display-sm font-display text-osita-900">Projects</h1>
            <p className="text-body text-osita-500 mt-1">
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
      <div className="max-w-6xl mx-auto px-8 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-osita-400" />
              <p className="text-body-sm text-osita-500">Loading projects...</p>
            </div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="card card-hover p-6 cursor-pointer group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-osita-100 flex items-center justify-center group-hover:bg-osita-900 group-hover:scale-105 transition-all duration-300">
                      <FolderOpen className="w-5 h-5 text-osita-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  <h3 className="text-title text-osita-900 mb-2 group-hover:text-osita-700 transition-colors">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-4 text-body-sm text-osita-500 mb-5">
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

                  <div className="flex items-center justify-between pt-5 border-t border-osita-100">
                    <span className="text-caption text-osita-400">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(project.id, project.name)
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-osita-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-4 h-4 text-osita-400" />
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-24"
    >
      <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-osita-100 flex items-center justify-center">
        <Zap className="w-10 h-10 text-osita-400" />
      </div>

      <h2 className="text-display-sm font-display text-osita-900 mb-3">
        Welcome to Osita
      </h2>
      <p className="text-body-lg text-osita-500 max-w-md mx-auto mb-10">
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-osita-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-2xl shadow-elevated w-full max-w-lg border border-osita-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-osita-100">
          <div>
            <h2 className="text-title text-osita-900">Create New Project</h2>
            <p className="text-body-sm text-osita-500 mt-0.5">Set up a new CBAM filing project</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-osita-100 text-osita-400 hover:text-osita-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-body-sm font-medium text-osita-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q1 2024 CBAM Report"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-osita-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-osita-700 mb-2">
                Reporting Period
              </label>
              <select
                value={formData.reporting_period || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  reporting_period: e.target.value as ReportingPeriod || undefined
                })}
              >
                <option value="">Select...</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-osita-700 mb-2">
                Year
              </label>
              <input
                type="text"
                value={formData.reporting_year || ''}
                onChange={(e) => setFormData({ ...formData, reporting_year: e.target.value })}
                placeholder="2024"
                pattern="\d{4}"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-sm font-medium text-osita-700 mb-2">
              Emission Factor Source
            </label>
            <select
              value={formData.emission_factor_source}
              onChange={(e) => setFormData({ ...formData, emission_factor_source: e.target.value })}
            >
              <option value="commission_default">Commission Default Values</option>
              <option value="provided">Custom / Provided Value</option>
            </select>
          </div>

          {formData.emission_factor_source === 'provided' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-body-sm font-medium text-osita-700 mb-2">
                Emission Factor (tCO2/MWh)
              </label>
              <input
                type="text"
                value={formData.emission_factor_value || ''}
                onChange={(e) => setFormData({ ...formData, emission_factor_value: e.target.value })}
                placeholder="e.g., 0.45"
              />
            </motion.div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-osita-100 -mx-6 px-6 -mb-6 pb-6 mt-6">
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
