import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Upload,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Loader2,
  ChevronRight,
  Zap,
  AlertCircle,
  Building2,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsApi } from '../api/projects'
import { documentsApi } from '../api/documents'
import StatusBadge from '../components/StatusBadge'
import FileDropzone from '../components/FileDropzone'
import ValidationPanel from '../components/ValidationPanel'
import type { Document } from '../types'

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState<'documents' | 'settings' | 'validation'>('documents')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const { data: documentsData, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.listByProject(projectId!),
    enabled: !!projectId,
    refetchInterval: 5000, // Poll for status updates
  })

  const validateMutation = useMutation({
    mutationFn: () => projectsApi.validate(projectId!),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      if (result.can_export) {
        toast.success('Validation passed! Ready to export.')
      } else {
        toast.error(`${result.blocking_count} blocking issue(s) found`)
      }
    },
    onError: () => {
      toast.error('Validation failed')
    },
  })

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    try {
      await documentsApi.upload(projectId!, selectedFiles)
      toast.success(`Uploaded ${selectedFiles.length} file(s)`)
      setSelectedFiles([])
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] })
    } catch {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-osita-500" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-400 mb-4">Project not found</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const documents = documentsData?.documents || []
  const canonicalData = project.canonical_data

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-midnight-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{project.name}</span>
          </div>

          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-osita-500/20 to-osita-600/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-osita-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
                  <StatusBadge status={project.status} size="md" />
                </div>
                {project.reporting_period && (
                  <p className="text-sm text-gray-500 mt-1">
                    {project.reporting_period} {project.reporting_year}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => validateMutation.mutate()}
                disabled={validateMutation.isPending}
                className="btn btn-secondary"
              >
                {validateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Validate
              </button>
              <button
                onClick={() => navigate(`/project/${projectId}/export`)}
                className="btn btn-primary"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-white/5 -mb-[1px]">
            {[
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'validation', label: 'Validation', icon: AlertCircle },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === id
                    ? 'border-osita-500 text-osita-400'
                    : 'border-transparent text-gray-500 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'documents' && (
          <DocumentsTab
            documents={documents}
            isLoading={docsLoading}
            projectId={projectId!}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            isUploading={isUploading}
            onUpload={handleUpload}
            onRemoveFile={handleRemoveFile}
          />
        )}

        {activeTab === 'validation' && (
          <ValidationTab projectId={projectId!} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab project={project} />
        )}
      </div>

      {/* Summary Footer */}
      {canonicalData && canonicalData.total_electricity_mwh > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-midnight-900/90 backdrop-blur-xl border-t border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Electricity</p>
                <p className="text-lg font-semibold text-white">
                  {canonicalData.total_electricity_mwh?.toFixed(3)} MWh
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Indirect Emissions</p>
                <p className="text-lg font-semibold text-osita-400">
                  {canonicalData.total_indirect_emissions_tco2?.toFixed(3)} tCO₂
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Documents</p>
                <p className="text-lg font-semibold text-white">{documents.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DocumentsTabProps {
  documents: Document[]
  isLoading: boolean
  projectId: string
  selectedFiles: File[]
  setSelectedFiles: (files: File[]) => void
  isUploading: boolean
  onUpload: () => void
  onRemoveFile: (index: number) => void
}

function DocumentsTab({
  documents,
  isLoading,
  projectId,
  selectedFiles,
  setSelectedFiles,
  isUploading,
  onUpload,
  onRemoveFile,
}: DocumentsTabProps) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload Section */}
      <div className="lg:col-span-1">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-osita-400" />
            Upload Documents
          </h3>
          
          <FileDropzone
            onFilesSelected={(files) => setSelectedFiles([...selectedFiles, ...files])}
            selectedFiles={selectedFiles}
            onRemoveFile={onRemoveFile}
            isUploading={isUploading}
          />

          {selectedFiles.length > 0 && (
            <button
              onClick={onUpload}
              disabled={isUploading}
              className="btn btn-primary w-full mt-4"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="lg:col-span-2">
        <h3 className="text-lg font-medium text-white mb-4">
          Uploaded Documents ({documents.length})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-osita-500" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (doc.status === 'extraction_complete' || doc.status === 'reviewed') {
                    navigate(`/project/${projectId}/document/${doc.id}`)
                  }
                }}
                className={`
                  card p-4 flex items-center justify-between
                  ${(doc.status === 'extraction_complete' || doc.status === 'reviewed')
                    ? 'cursor-pointer hover:border-white/10'
                    : ''
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-coral-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-coral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{doc.original_filename}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      {doc.page_count && <span>{doc.page_count} pages</span>}
                      {doc.detected_language && (
                        <span className="uppercase">{doc.detected_language}</span>
                      )}
                      {doc.ocr_confidence && (
                        <span>OCR: {(doc.ocr_confidence * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  {(doc.status === 'extraction_complete' || doc.status === 'reviewed') && (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload PDF energy bills to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ValidationTab({ projectId }: { projectId: string }) {
  const { data: validationResult } = useQuery({
    queryKey: ['validation', projectId],
    queryFn: () => projectsApi.validate(projectId),
    staleTime: 0,
  })

  if (!validationResult) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-osita-500" />
      </div>
    )
  }

  return (
    <ValidationPanel
      flags={validationResult.flags}
      blockingCount={validationResult.blocking_count}
      warningCount={validationResult.warning_count}
      infoCount={validationResult.info_count}
      canExport={validationResult.can_export}
    />
  )
}

function SettingsTab({ project }: { project: any }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    declarant_name: project.declarant_info?.name || '',
    declarant_id: project.declarant_info?.identification_number || '',
    declarant_role: project.declarant_info?.role || '',
    declarant_country: project.declarant_info?.address?.country || '',
    declarant_city: project.declarant_info?.address?.city || '',
    installation_name: project.installation_info?.name || '',
    installation_country: project.installation_info?.country || '',
    emission_factor_source: project.emission_factor_source || 'commission_default',
    emission_factor_value: project.emission_factor_value || '',
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => projectsApi.update(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] })
      toast.success('Settings saved!')
      setIsEditing(false)
    },
    onError: () => {
      toast.error('Failed to save settings')
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      declarant_info: {
        name: formData.declarant_name,
        identification_number: formData.declarant_id,
        role: formData.declarant_role || undefined,
        address: formData.declarant_country ? {
          country: formData.declarant_country,
          city: formData.declarant_city || 'N/A',
        } : undefined,
      },
      installation_info: formData.installation_name ? {
        name: formData.installation_name,
        country: formData.installation_country,
      } : undefined,
      emission_factor_source: formData.emission_factor_source,
      emission_factor_value: formData.emission_factor_value || undefined,
    })
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Edit Toggle */}
      <div className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="btn btn-primary"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
          >
            Edit Settings
          </button>
        )}
      </div>

      {/* Declarant Info */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-osita-400" />
          Declarant Information
          <span className="text-xs text-coral-400 ml-2">Required</span>
        </h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.declarant_name}
                  onChange={(e) => setFormData({ ...formData, declarant_name: e.target.value })}
                  placeholder="Company or person name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">EORI / ID Number *</label>
                <input
                  type="text"
                  value={formData.declarant_id}
                  onChange={(e) => setFormData({ ...formData, declarant_id: e.target.value })}
                  placeholder="e.g., DE123456789012345"
                  className="w-full font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.declarant_role}
                  onChange={(e) => setFormData({ ...formData, declarant_role: e.target.value })}
                  placeholder="e.g., Importer"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Country Code</label>
                <input
                  type="text"
                  value={formData.declarant_country}
                  onChange={(e) => setFormData({ ...formData, declarant_country: e.target.value.toUpperCase() })}
                  placeholder="e.g., DE"
                  maxLength={2}
                  className="w-full uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <input
                type="text"
                value={formData.declarant_city}
                onChange={(e) => setFormData({ ...formData, declarant_city: e.target.value })}
                placeholder="e.g., Berlin"
                className="w-full"
              />
            </div>
          </div>
        ) : project.declarant_info ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-white">{project.declarant_info.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Identification Number</dt>
              <dd className="text-white font-mono">{project.declarant_info.identification_number}</dd>
            </div>
            {project.declarant_info.role && (
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="text-white">{project.declarant_info.role}</dd>
              </div>
            )}
            {project.declarant_info.address?.country && (
              <div>
                <dt className="text-gray-500">Country</dt>
                <dd className="text-white">{project.declarant_info.address.country}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-coral-400 text-sm">
            ⚠️ No declarant information provided. Click "Edit Settings" to add.
          </p>
        )}
      </div>

      {/* Installation Info */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-osita-400" />
          Installation Information
        </h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Installation Name</label>
              <input
                type="text"
                value={formData.installation_name}
                onChange={(e) => setFormData({ ...formData, installation_name: e.target.value })}
                placeholder="e.g., Power Plant Alpha"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Country Code</label>
              <input
                type="text"
                value={formData.installation_country}
                onChange={(e) => setFormData({ ...formData, installation_country: e.target.value.toUpperCase() })}
                placeholder="e.g., DE"
                maxLength={2}
                className="w-full uppercase"
              />
            </div>
          </div>
        ) : project.installation_info ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-white">{project.installation_info.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Country</dt>
              <dd className="text-white">{project.installation_info.country}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-500 text-sm">
            No installation information provided. (Optional)
          </p>
        )}
      </div>

      {/* Emission Factor */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-osita-400" />
          Emission Factor
        </h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Source</label>
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
                <label className="block text-sm text-gray-400 mb-1">Value (tCO₂/MWh)</label>
                <input
                  type="text"
                  value={formData.emission_factor_value}
                  onChange={(e) => setFormData({ ...formData, emission_factor_value: e.target.value })}
                  placeholder="e.g., 0.45"
                  className="w-full"
                />
              </div>
            )}
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Source</dt>
              <dd className="text-white capitalize">
                {project.emission_factor_source?.replace('_', ' ') || 'Commission Default'}
              </dd>
            </div>
            {project.emission_factor_value && (
              <div>
                <dt className="text-gray-500">Value</dt>
                <dd className="text-white">{project.emission_factor_value} tCO₂/MWh</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </div>
  )
}

