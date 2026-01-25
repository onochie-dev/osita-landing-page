import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileCode,
  Send,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsApi } from '../api/projects'
import { documentsApi } from '../api/documents'
import StatusBadge from '../components/StatusBadge'
import FileDropzone from '../components/FileDropzone'
import { cn } from '../lib/cn'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const { data: documentsData } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.listByProject(projectId!),
    enabled: !!projectId,
    refetchInterval: 5000,
  })

  const { data: validationResult } = useQuery({
    queryKey: ['validation', projectId],
    queryFn: () => projectsApi.validate(projectId!),
    enabled: !!projectId,
  })

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    try {
      await documentsApi.upload(projectId!, selectedFiles)
      toast.success(`Uploaded ${selectedFiles.length} file(s)`)
      setSelectedFiles([])
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] })
      queryClient.invalidateQueries({ queryKey: ['validation', projectId] })
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
      <div className="flex items-center justify-center min-h-screen bg-osita-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-osita-400" />
          <p className="text-body-sm text-osita-500">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-osita-50">
        <p className="text-osita-500 mb-4">Project not found</p>
        <Link to="/" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const documents = documentsData?.documents || []
  const canonicalData = project.canonical_data
  const canExport = validationResult?.can_export ?? false
  const blockingFlags = validationResult?.flags?.filter(f => f.severity === 'blocking') || []
  const warningFlags = validationResult?.flags?.filter(f => f.severity === 'warning') || []

  // Calculate compliance status based on actual data
  const hasDocuments = documents.length > 0
  const extractedDocs = documents.filter(d => d.status === 'extraction_complete' || d.status === 'reviewed')
  const processingDocs = documents.filter(d => d.status === 'ocr_processing' || d.status === 'extraction_processing')

  // Indirect emissions: complete when all docs are extracted and there's actual data
  const indirectHasData = hasDocuments && extractedDocs.length > 0
  const indirectComplete = hasDocuments && extractedDocs.length === documents.length && processingDocs.length === 0
  const indirectProgress = hasDocuments ? Math.round((extractedDocs.length / documents.length) * 100) : 0

  // For this MVP, we only handle indirect emissions (electricity)
  // Direct emissions would require different document types

  return (
    <div className="min-h-screen bg-osita-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: project.name }]} />

        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-display-sm font-display text-osita-900">CBAM Compliance Engine</h1>
          <p className="text-body text-osita-500 mt-1">
            {project.reporting_period} {project.reporting_year} · Upload electricity bills to calculate indirect emissions
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-6" padding="lg">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-osita-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-osita-500" />
            </div>
            <p className="text-body font-medium text-osita-700 mb-1">Drop documents here</p>
            <p className="text-body-sm text-osita-400 mb-4">or</p>

            <FileDropzone
              onFilesSelected={(files) => setSelectedFiles([...selectedFiles, ...files])}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
              isUploading={isUploading}
            />

            {selectedFiles.length > 0 && (
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                icon={<Upload className="w-4 h-4" />}
                className="mt-4"
              >
                Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </Button>
            )}

            <p className="text-caption text-osita-400 mt-4">Supported: PDF, Excel, CSV, Word</p>
          </div>
        </Card>

        {/* Emissions Status Accordions */}
        <Accordion type="multiple" defaultOpen={['indirect']}>
          {/* Direct Emissions - Not applicable for this MVP */}
          <AccordionItem value="direct">
            <AccordionTrigger value="direct">
              Direct emissions compliance status
            </AccordionTrigger>
            <AccordionContent value="direct">
              <div className="text-center py-8 text-osita-500">
                <Info className="w-8 h-8 mx-auto mb-3 text-osita-400" />
                <p className="font-medium">Not applicable</p>
                <p className="text-body-sm mt-1">This system handles indirect emissions (electricity) only.</p>
                <p className="text-body-sm mt-1">Direct emissions require separate reporting.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Indirect Emissions */}
          <AccordionItem value="indirect">
            <AccordionTrigger value="indirect">
              Indirect emissions compliance status
            </AccordionTrigger>
            <AccordionContent value="indirect">
              {documents.length > 0 ? (
                <div className="space-y-6">
                  {/* Submissions List */}
                  <div>
                    <p className="text-body-sm font-medium text-osita-700 mb-3">Submissions:</p>
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => {
                            if (doc.status === 'extraction_complete' || doc.status === 'reviewed') {
                              navigate(`/project/${projectId}/document/${doc.id}`)
                            }
                          }}
                          className={cn(
                            'submission-card flex items-center justify-between',
                            (doc.status === 'extraction_complete' || doc.status === 'reviewed') && 'success cursor-pointer hover:bg-osita-100'
                          )}
                        >
                          <div>
                            <p className="font-medium text-osita-900">{doc.original_filename}</p>
                            <div className="flex items-center gap-4 text-body-sm text-osita-500 mt-1">
                              {doc.extraction_data?.period_start && (
                                <span>Period: {doc.extraction_data.period_start}</span>
                              )}
                              {doc.extraction_data?.total_consumption && (
                                <span>Energy consumed: {doc.extraction_data.total_consumption} kWh</span>
                              )}
                              {!doc.extraction_data?.period_start && doc.page_count && (
                                <span>{doc.page_count} pages</span>
                              )}
                            </div>
                          </div>
                          {(doc.status === 'extraction_complete' || doc.status === 'reviewed') ? (
                            <div className="check-circle">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <StatusBadge status={doc.status} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emissions Calculation */}
                  {canonicalData && (canonicalData.total_electricity_mwh ?? 0) > 0 && (
                    <div className="border-t border-osita-200 pt-4">
                      <p className="text-body-sm font-medium text-osita-700 mb-3">Emissions calculation:</p>
                      <p className="text-caption text-osita-500 mb-4">Calculated using default grid emissions factors</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-body-sm">
                          <span className="text-osita-600">Total electricity consumed:</span>
                          <span className="font-medium text-osita-900">
                            {((canonicalData.total_electricity_mwh ?? 0) * 1000).toLocaleString()} kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-body-sm">
                          <span className="text-osita-600">Applied grid emissions factor:</span>
                          <span className="font-medium text-osita-900">
                            {project.emission_factor_value || '0.475'} kg CO2e / kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-body-sm border-t border-osita-200 pt-3">
                          <span className="text-osita-600">Total CO2e emissions:</span>
                          <span className="font-semibold text-osita-900">
                            {canonicalData.total_indirect_emissions_tco2?.toFixed(2)} tCO2e
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-osita-500">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-osita-400" />
                  <p className="font-medium">No documents uploaded</p>
                  <p className="text-body-sm mt-1">Upload electricity bills to calculate indirect emissions</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right Rail - Compliance Status & Actions */}
      <div className="w-96 border-l border-osita-200 bg-white p-6 overflow-auto">
        {/* Compliance Status Card */}
        <Card className="mb-6" padding="md">
          <CardHeader
            title="Compliance Status"
            action={
              <Badge variant={canExport ? 'success' : (hasDocuments ? 'warning' : 'neutral')} size="sm">
                {canExport ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Ready
                  </>
                ) : hasDocuments ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Review Required
                  </>
                ) : (
                  'Not Started'
                )}
              </Badge>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {/* Indirect Emissions - This is what we track */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-osita-600">Indirect emissions</span>
                  <Badge
                    variant={indirectComplete ? 'success' : (indirectHasData ? 'warning' : 'neutral')}
                    size="sm"
                  >
                    {indirectComplete ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Complete
                      </>
                    ) : indirectHasData ? (
                      'In Progress'
                    ) : (
                      'Not Started'
                    )}
                  </Badge>
                </div>
                <Progress
                  value={indirectProgress}
                  variant={indirectComplete ? 'success' : 'default'}
                />
                <p className="text-caption text-osita-500 mt-1">
                  {hasDocuments
                    ? `${extractedDocs.length} of ${documents.length} documents processed`
                    : 'Upload documents to begin'
                  }
                </p>
              </div>

              {/* Direct Emissions - Not tracked in this MVP */}
              <div className="opacity-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm text-osita-600">Direct emissions</span>
                  <Badge variant="neutral" size="sm">
                    N/A
                  </Badge>
                </div>
                <Progress value={0} variant="default" />
                <p className="text-caption text-osita-500 mt-1">Not applicable (electricity only)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Issues - Show what's blocking export */}
        {(blockingFlags.length > 0 || warningFlags.length > 0) && (
          <Card className="mb-6" padding="md">
            <CardHeader title="Issues to Resolve" />
            <CardContent>
              <div className="space-y-3">
                {/* Blocking Issues */}
                {blockingFlags.map((flag, idx) => (
                  <div key={`blocking-${idx}`} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-body-sm font-medium text-red-800">{flag.message}</p>
                      {flag.suggestion && (
                        <p className="text-caption text-red-600 mt-1">{flag.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Warning Issues */}
                {warningFlags.map((flag, idx) => (
                  <div key={`warning-${idx}`} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-body-sm font-medium text-amber-800">{flag.message}</p>
                      {flag.suggestion && (
                        <p className="text-caption text-amber-600 mt-1">{flag.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How to become compliant - show when not ready */}
        {!canExport && !hasDocuments && (
          <Card className="mb-6 bg-osita-50 border-osita-200" padding="md">
            <CardHeader title="How to get compliant" />
            <CardContent>
              <ol className="text-body-sm text-osita-700 space-y-2 list-decimal list-inside">
                <li>Upload your electricity bills (PDF)</li>
                <li>Wait for automatic extraction</li>
                <li>Review and confirm extracted data</li>
                <li>Add declarant information in Settings</li>
                <li>Export your report</li>
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            fullWidth
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={() => navigate(`/project/${projectId}/export`)}
          >
            Generate Excel File
          </Button>

          <Button
            fullWidth
            variant="secondary"
            icon={<FileCode className="w-4 h-4" />}
            onClick={() => navigate(`/project/${projectId}/export`)}
          >
            Generate XML File
          </Button>

          <Button
            fullWidth
            variant="secondary"
            icon={<Send className="w-4 h-4" />}
            disabled={!canExport}
          >
            Submit to CBAM Registry
          </Button>
        </div>

        {/* Settings link for declarant info */}
        {blockingFlags.some(f => f.message.toLowerCase().includes('declarant')) && (
          <div className="mt-4 p-3 bg-osita-100 rounded-xl">
            <p className="text-body-sm text-osita-700">
              Missing declarant information?
              <Link
                to={`/project/${projectId}/export`}
                className="text-osita-900 font-medium ml-1 underline"
              >
                Go to Export page
              </Link>
              {' '}and click "Review Issues" to add it.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
