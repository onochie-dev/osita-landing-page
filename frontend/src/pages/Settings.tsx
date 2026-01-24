import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  ChevronRight, 
  Building2, 
  Calendar, 
  User, 
  MapPin,
  FileText,
  Zap,
  Save,
  X,
  Check,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react'
import { projectsApi } from '../api/projects'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import type { Project, ProjectUpdate, ReportingPeriod, DeclarantInfo, InstallationInfo, Address } from '../types'

export default function Settings() {
  const queryClient = useQueryClient()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<ProjectUpdate | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch all projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) => 
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId] })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setSelectedProjectId(null)
      setEditingProject(null)
      setDeleteConfirm(null)
    },
  })

  const selectedProject = projects?.find(p => p.id === selectedProjectId)

  const handleSelectProject = (project: Project) => {
    setSelectedProjectId(project.id)
    setEditingProject({
      name: project.name,
      description: project.description || '',
      reporting_period: project.reporting_period,
      reporting_year: project.reporting_year || '',
      declarant_info: project.declarant_info || undefined,
      installation_info: project.installation_info || undefined,
      emission_factor_source: project.emission_factor_source,
      emission_factor_value: project.emission_factor_value || '',
    })
    setSaveSuccess(false)
  }

  const handleSave = () => {
    if (!selectedProjectId || !editingProject) return
    updateMutation.mutate({ id: selectedProjectId, data: editingProject })
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const updateField = <K extends keyof ProjectUpdate>(field: K, value: ProjectUpdate[K]) => {
    if (!editingProject) return
    setEditingProject({ ...editingProject, [field]: value })
  }

  const updateDeclarantField = (field: keyof DeclarantInfo, value: string) => {
    if (!editingProject) return
    const currentDeclarant = editingProject.declarant_info || {
      identification_number: '',
      name: '',
    }
    setEditingProject({
      ...editingProject,
      declarant_info: { ...currentDeclarant, [field]: value },
    })
  }

  const updateDeclarantAddress = (field: keyof Address, value: string) => {
    if (!editingProject) return
    const currentDeclarant = editingProject.declarant_info || {
      identification_number: '',
      name: '',
    }
    const currentAddress = currentDeclarant.address || {
      country: '',
      city: '',
    }
    setEditingProject({
      ...editingProject,
      declarant_info: {
        ...currentDeclarant,
        address: { ...currentAddress, [field]: value },
      },
    })
  }

  const updateInstallationField = (field: keyof InstallationInfo, value: string) => {
    if (!editingProject) return
    const currentInstallation = editingProject.installation_info || {}
    setEditingProject({
      ...editingProject,
      installation_info: { ...currentInstallation, [field]: value },
    })
  }

  const updateInstallationAddress = (field: keyof Address, value: string) => {
    if (!editingProject) return
    const currentInstallation = editingProject.installation_info || {}
    const currentAddress = currentInstallation.address || {
      country: '',
      city: '',
    }
    setEditingProject({
      ...editingProject,
      installation_info: {
        ...currentInstallation,
        address: { ...currentAddress, [field]: value },
      },
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-osita-400" />
          <p className="text-body-sm text-osita-500">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-osita-50">
      {/* Header */}
      <header className="bg-white border-b border-osita-200/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Breadcrumb items={[{ label: 'Settings' }]} />
          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-xl bg-osita-100 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-osita-600" />
            </div>
            <div>
              <h1 className="text-display-sm font-display text-osita-900">Settings</h1>
              <p className="text-body text-osita-500 mt-0.5">
                Manage your projects, update reporting periods, company information, and more.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1">
          <Card padding="none">
            <div className="p-5 border-b border-osita-100">
              <h2 className="text-title text-osita-900">Your Projects</h2>
              <p className="text-body-sm text-osita-500 mt-1">
                Select a project to edit its settings
              </p>
            </div>
            <div className="divide-y divide-osita-100">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={`w-full p-4 text-left hover:bg-osita-50 transition-all duration-200 flex items-center justify-between group ${
                      selectedProjectId === project.id ? 'bg-osita-50 border-l-[3px] border-l-osita-900' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-osita-900 truncate">{project.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {project.reporting_period && project.reporting_year ? (
                          <Badge variant="info" size="sm">
                            {project.reporting_period} {project.reporting_year}
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">No period set</Badge>
                        )}
                        <span className="text-caption text-osita-400">
                          {project.document_count} doc{project.document_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-osita-300 group-hover:text-osita-500 transition-colors ${
                      selectedProjectId === project.id ? 'text-osita-600' : ''
                    }`} />
                  </button>
                ))
              ) : (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-xl bg-osita-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-osita-400" />
                  </div>
                  <p className="text-body font-medium text-osita-600">No projects yet</p>
                  <p className="text-body-sm text-osita-400 mt-1">
                    Create a project from the Dashboard first
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Project Settings Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedProject && editingProject ? (
              <motion.div
                key={selectedProjectId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Success message */}
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-osita-900 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-4 h-4 text-osita-900" />
                    </div>
                    <span className="text-body font-medium text-white">Settings saved successfully!</span>
                  </motion.div>
                )}

                {/* Basic Info */}
                <Card padding="none">
                  <div className="p-5 border-b border-osita-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-osita-100 flex items-center justify-center">
                      <FileText className="w-[18px] h-[18px] text-osita-600" />
                    </div>
                    <h3 className="text-title text-osita-900">Project Information</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={editingProject.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editingProject.description || ''}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={3}
                        className="resize-none"
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                </Card>

                {/* Reporting Period */}
                <Card padding="none">
                  <div className="p-5 border-b border-osita-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-osita-100 flex items-center justify-center">
                      <Calendar className="w-[18px] h-[18px] text-osita-600" />
                    </div>
                    <h3 className="text-title text-osita-900">Reporting Period</h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Quarter
                      </label>
                      <select
                        value={editingProject.reporting_period || ''}
                        onChange={(e) => updateField('reporting_period', e.target.value as ReportingPeriod)}
                      >
                        <option value="">Select quarter</option>
                        <option value="Q1">Q1 (Jan - Mar)</option>
                        <option value="Q2">Q2 (Apr - Jun)</option>
                        <option value="Q3">Q3 (Jul - Sep)</option>
                        <option value="Q4">Q4 (Oct - Dec)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Year
                      </label>
                      <select
                        value={editingProject.reporting_year || ''}
                        onChange={(e) => updateField('reporting_year', e.target.value)}
                      >
                        <option value="">Select year</option>
                        {[2024, 2025, 2026, 2027, 2028].map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Declarant Information */}
                <Card padding="none">
                  <div className="p-5 border-b border-osita-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-osita-100 flex items-center justify-center">
                      <User className="w-[18px] h-[18px] text-osita-600" />
                    </div>
                    <h3 className="text-title text-osita-900">Declarant Information</h3>
                    <Badge variant="info" size="sm">Required for export</Badge>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          EORI / ID Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingProject.declarant_info?.identification_number || ''}
                          onChange={(e) => updateDeclarantField('identification_number', e.target.value)}
                          placeholder="e.g., DE123456789012345"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingProject.declarant_info?.name || ''}
                          onChange={(e) => updateDeclarantField('name', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={editingProject.declarant_info?.role || ''}
                        onChange={(e) => updateDeclarantField('role', e.target.value)}
                        placeholder="e.g., Importer"
                      />
                    </div>
                    <div className="pt-5 border-t border-osita-100">
                      <h4 className="text-body-sm font-medium text-osita-700 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-osita-500" />
                        Declarant Address
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Country Code (ISO)
                          </label>
                          <input
                            type="text"
                            value={editingProject.declarant_info?.address?.country || ''}
                            onChange={(e) => updateDeclarantAddress('country', e.target.value.toUpperCase().slice(0, 2))}
                            className="uppercase"
                            placeholder="e.g., DE"
                            maxLength={2}
                          />
                        </div>
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={editingProject.declarant_info?.address?.city || ''}
                            onChange={(e) => updateDeclarantAddress('city', e.target.value)}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Street
                          </label>
                          <input
                            type="text"
                            value={editingProject.declarant_info?.address?.street || ''}
                            onChange={(e) => updateDeclarantAddress('street', e.target.value)}
                            placeholder="Enter street address"
                          />
                        </div>
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={editingProject.declarant_info?.address?.postcode || ''}
                            onChange={(e) => updateDeclarantAddress('postcode', e.target.value)}
                            placeholder="Enter postcode"
                          />
                        </div>
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Region/Subdivision
                          </label>
                          <input
                            type="text"
                            value={editingProject.declarant_info?.address?.sub_division || ''}
                            onChange={(e) => updateDeclarantAddress('sub_division', e.target.value)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Installation Information */}
                <Card padding="none">
                  <div className="p-5 border-b border-osita-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-osita-100 flex items-center justify-center">
                      <Building2 className="w-[18px] h-[18px] text-osita-600" />
                    </div>
                    <h3 className="text-title text-osita-900">Installation / Facility Information</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Installation Name
                        </label>
                        <input
                          type="text"
                          value={editingProject.installation_info?.name || ''}
                          onChange={(e) => updateInstallationField('name', e.target.value)}
                          placeholder="e.g., Main Factory"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Identifier
                        </label>
                        <input
                          type="text"
                          value={editingProject.installation_info?.identifier || ''}
                          onChange={(e) => updateInstallationField('identifier', e.target.value)}
                          placeholder="Facility ID"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Country Code (ISO)
                        </label>
                        <input
                          type="text"
                          value={editingProject.installation_info?.country || ''}
                          onChange={(e) => updateInstallationField('country', e.target.value.toUpperCase().slice(0, 2))}
                          className="uppercase"
                          placeholder="e.g., DE"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Economic Activity
                        </label>
                        <input
                          type="text"
                          value={editingProject.installation_info?.economic_activity || ''}
                          onChange={(e) => updateInstallationField('economic_activity', e.target.value)}
                          placeholder="e.g., Manufacturing"
                        />
                      </div>
                    </div>
                    <div className="pt-5 border-t border-osita-100">
                      <h4 className="text-body-sm font-medium text-osita-700 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-osita-500" />
                        Installation Address
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={editingProject.installation_info?.address?.city || ''}
                            onChange={(e) => updateInstallationAddress('city', e.target.value)}
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={editingProject.installation_info?.address?.country || ''}
                            onChange={(e) => updateInstallationAddress('country', e.target.value.toUpperCase().slice(0, 2))}
                            className="uppercase"
                            placeholder="e.g., DE"
                            maxLength={2}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Street
                          </label>
                          <input
                            type="text"
                            value={editingProject.installation_info?.address?.street || ''}
                            onChange={(e) => updateInstallationAddress('street', e.target.value)}
                            placeholder="Enter street address"
                          />
                        </div>
                        <div>
                          <label className="block text-body-sm font-medium text-osita-600 mb-2">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={editingProject.installation_info?.address?.postcode || ''}
                            onChange={(e) => updateInstallationAddress('postcode', e.target.value)}
                            placeholder="Enter postcode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Emission Factor */}
                <Card padding="none">
                  <div className="p-5 border-b border-osita-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-osita-100 flex items-center justify-center">
                      <Zap className="w-[18px] h-[18px] text-osita-600" />
                    </div>
                    <h3 className="text-title text-osita-900">Emission Factor Settings</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-body-sm font-medium text-osita-700 mb-2">
                        Emission Factor Source
                      </label>
                      <select
                        value={editingProject.emission_factor_source || 'commission_default'}
                        onChange={(e) => updateField('emission_factor_source', e.target.value)}
                      >
                        <option value="commission_default">EU Commission Default Values</option>
                        <option value="supplier_specific">Supplier Specific</option>
                        <option value="national_grid">National Grid Average</option>
                        <option value="custom">Custom Value</option>
                      </select>
                    </div>
                    {editingProject.emission_factor_source === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-body-sm font-medium text-osita-700 mb-2">
                          Custom Emission Factor (tCO2/MWh)
                        </label>
                        <input
                          type="text"
                          value={editingProject.emission_factor_value || ''}
                          onChange={(e) => updateField('emission_factor_value', e.target.value)}
                          placeholder="e.g., 0.4"
                        />
                      </motion.div>
                    )}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteConfirm(selectedProjectId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedProjectId(null)
                        setEditingProject(null)
                      }}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={updateMutation.isPending}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                <AnimatePresence>
                  {deleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-osita-950/40 backdrop-blur-sm flex items-center justify-center z-50"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.96, opacity: 0, y: 8 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="glass rounded-2xl p-6 max-w-md mx-4 shadow-elevated border border-osita-200/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <h3 className="text-title text-osita-900">Delete Project?</h3>
                        </div>
                        <p className="text-body text-osita-600 mb-6">
                          Are you sure you want to delete "{selectedProject?.name}"? This will permanently remove all documents and data associated with this project.
                        </p>
                        <div className="flex justify-end gap-3">
                          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(deleteConfirm)}
                            isLoading={deleteMutation.isPending}
                          >
                            Delete Project
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-osita-100 flex items-center justify-center mx-auto mb-6">
                    <SettingsIcon className="w-10 h-10 text-osita-400" />
                  </div>
                  <h3 className="text-display-sm font-display text-osita-700 mb-3">
                    Select a Project
                  </h3>
                  <p className="text-body text-osita-500 max-w-md">
                    Choose a project from the list to view and edit its settings, including reporting period, company information, and more.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  )
}

