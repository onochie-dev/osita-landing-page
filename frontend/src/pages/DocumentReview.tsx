import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Edit3,
  FileText,
  Loader2,
  Eye,
  Languages,
  Save,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '../lib/cn'
import { documentsApi } from '../api/documents'
import { extractionsApi } from '../api/extractions'
import { projectsApi } from '../api/projects'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import type { ExtractedField, FieldStatus } from '../types'

export default function DocumentReview() {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedPage, setSelectedPage] = useState(1)
  const [editingField, setEditingField] = useState<string | null>(null)

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const { data: document, isLoading: docLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentsApi.get(documentId!),
    enabled: !!documentId,
  })

  const { data: ocrResult } = useQuery({
    queryKey: ['ocr', documentId],
    queryFn: () => documentsApi.getOcr(documentId!),
    enabled: !!documentId && document?.status !== 'uploaded',
  })

  const { data: fields, isLoading: fieldsLoading } = useQuery({
    queryKey: ['fields', documentId],
    queryFn: () => extractionsApi.getFields(documentId!),
    enabled: !!documentId,
  })

  const confirmAllMutation = useMutation({
    mutationFn: () => extractionsApi.confirmAllFields(documentId!),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['fields', documentId] })
      toast.success(`Confirmed ${result.confirmed_count} field(s)`)
    },
  })

  if (docLoading || fieldsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-500 mb-4">Document not found</p>
        <Link to={`/project/${projectId}`} className="btn btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>
      </div>
    )
  }

  const currentPage = ocrResult?.pages?.find((p) => p.page_number === selectedPage)
  const unconfirmedCount = fields?.filter((f) => f.status === 'unconfirmed').length || 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: project?.name || 'Project', href: `/project/${projectId}` },
              { label: document.original_filename }
            ]}
          />

          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">{document.original_filename}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-0.5">
                    {document.page_count && <span>{document.page_count} pages</span>}
                    <span className="flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" />
                      {document.detected_language?.toUpperCase() || 'Unknown'}
                    </span>
                    {document.ocr_confidence && (
                      <span>OCR: {(document.ocr_confidence * 100).toFixed(0)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unconfirmedCount > 0 && (
                <span className="text-sm text-slate-500">
                  {unconfirmedCount} unconfirmed
                </span>
              )}
              <Button
                onClick={() => confirmAllMutation.mutate()}
                isLoading={confirmAllMutation.isPending}
                disabled={unconfirmedCount === 0}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Confirm All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* PDF Viewer / OCR Text */}
        <Card className="flex-1 flex flex-col overflow-hidden" padding="none">
          {/* Page Navigation */}
          {ocrResult && ocrResult.page_count > 1 && (
            <div className="p-4 border-b border-slate-200 flex items-center justify-center gap-2 bg-slate-50">
              {Array.from({ length: ocrResult.page_count }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    selectedPage === page
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* OCR Text Display */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <h3 className="font-medium text-slate-900">OCR Output - Page {selectedPage}</h3>
            </div>
            
            {currentPage ? (
              <div
                className={cn(
                  'bg-slate-50 rounded-xl p-6 text-sm leading-relaxed border border-slate-200',
                  document.detected_language === 'ar' && 'text-right'
                )}
                dir={document.detected_language === 'ar' ? 'rtl' : 'ltr'}
              >
                <pre className="whitespace-pre-wrap font-sans text-slate-700">
                  {currentPage.markdown}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>OCR output not available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Extracted Fields */}
        <Card className="w-1/2 flex flex-col overflow-hidden" padding="none">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-medium text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-500" />
              Extracted Fields
            </h3>
          </div>

          <div className="flex-1 overflow-auto">
            {fields && fields.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Confidence</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      isEditing={editingField === field.id}
                      onEdit={() => setEditingField(field.id)}
                      onCancelEdit={() => setEditingField(null)}
                      onSaved={() => {
                        setEditingField(null)
                        queryClient.invalidateQueries({ queryKey: ['fields', documentId] })
                      }}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Edit3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No fields extracted</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

interface FieldRowProps {
  field: ExtractedField
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSaved: () => void
}

function FieldRow({ field, isEditing, onEdit, onCancelEdit, onSaved }: FieldRowProps) {
  const [value, setValue] = useState(field.value || '')
  const [unit, setUnit] = useState(field.unit || '')

  const updateMutation = useMutation({
    mutationFn: (data: { value?: string; unit?: string }) =>
      extractionsApi.updateField(field.id, data),
    onSuccess: () => {
      toast.success('Field updated')
      onSaved()
    },
    onError: () => {
      toast.error('Failed to update field')
    },
  })

  const confirmMutation = useMutation({
    mutationFn: () => extractionsApi.confirmField(field.id),
    onSuccess: () => {
      toast.success('Field confirmed')
      onSaved()
    },
  })

  const handleSave = () => {
    updateMutation.mutate({ value, unit: unit || undefined })
  }

  const confidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-emerald-600'
    if (conf >= 0.5) return 'text-amber-600'
    return 'text-red-600'
  }

  const statusConfig: Record<FieldStatus, { color: string; bg: string }> = {
    unconfirmed: { color: 'text-slate-600', bg: 'bg-slate-100' },
    confirmed: { color: 'text-emerald-700', bg: 'bg-emerald-50' },
    corrected: { color: 'text-amber-700', bg: 'bg-amber-50' },
    manual: { color: 'text-blue-700', bg: 'bg-blue-50' },
  }

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900 capitalize">
            {field.field_name.replace(/_/g, ' ')}
          </p>
          {field.source_page && (
            <p className="text-xs text-slate-500 mt-0.5">Page {field.source_page}</p>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 text-sm py-1.5"
              autoFocus
            />
            {field.unit !== undefined && (
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="unit"
                className="w-20 text-sm py-1.5"
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-slate-900">{field.value || '-'}</span>
            {field.unit && (
              <span className="text-xs text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded">
                {field.unit}
              </span>
            )}
          </div>
        )}
        
        {field.source_quote && !isEditing && (
          <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={field.source_quote}>
            "{field.source_quote}"
          </p>
        )}
      </td>
      
      <td className="px-4 py-3">
        {field.confidence !== undefined && (
          <span className={cn('font-mono text-sm font-medium', confidenceColor(field.confidence))}>
            {(field.confidence * 100).toFixed(0)}%
          </span>
        )}
      </td>
      
      <td className="px-4 py-3">
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full capitalize',
            statusConfig[field.status].color,
            statusConfig[field.status].bg
          )}
        >
          {field.status}
        </span>
      </td>
      
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onCancelEdit}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {field.status === 'unconfirmed' && (
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
                className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-600"
                title="Confirm"
              >
                {confirmMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}
