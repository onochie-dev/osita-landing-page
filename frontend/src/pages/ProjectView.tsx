import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileCode,
  Send,
  Check,
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
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-500 mb-4">Project not found</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const documents = documentsData?.documents || []
  const canonicalData = project.canonical_data
  const canExport = validationResult?.can_export ?? false

  // Calculate compliance status
  const hasDocuments = documents.length > 0
  const extractedDocs = documents.filter(d => d.status === 'extraction_complete' || d.status === 'reviewed')
  const indirectComplete = hasDocuments && extractedDocs.length === documents.length
  const directComplete = false // Not implemented for now
  const verificationComplete = indirectComplete // Simplified

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">CBAM Compliance Engine</h1>
        </div>

        {/* Upload Zone */}
        <Card className="mb-6" padding="lg">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Drop documents here</p>
            <p className="text-sm text-slate-500 mb-4">or</p>
            
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

            <p className="text-xs text-slate-400 mt-4">Supported: PDF, Excel, CSV, Word</p>
          </div>
        </Card>

        {/* Emissions Status Accordions */}
        <Accordion type="multiple" defaultOpen={['indirect']}>
          {/* Direct Emissions */}
          <AccordionItem value="direct">
            <AccordionTrigger value="direct">
              Direct emissions compliance status
            </AccordionTrigger>
            <AccordionContent value="direct">
              <div className="text-center py-8 text-slate-500">
                <p className="font-medium">No data available</p>
                <p className="text-sm mt-1">Upload documents to view compliance details</p>
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
                    <p className="text-sm font-medium text-slate-700 mb-3">Submissions:</p>
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
                            (doc.status === 'extraction_complete' || doc.status === 'reviewed') && 'success cursor-pointer hover:bg-slate-100'
                          )}
                        >
                          <div>
                            <p className="font-medium text-slate-900">{doc.original_filename}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
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
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">Emissions calculation:</p>
                      <p className="text-xs text-slate-500 mb-4">Calculated using default grid emissions factors</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Total electricity consumed:</span>
                          <span className="font-medium text-slate-900">
                            {((canonicalData.total_electricity_mwh ?? 0) * 1000).toLocaleString()} kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Applied grid emissions factor:</span>
                          <span className="font-medium text-slate-900">
                            {project.emission_factor_value || '0.475'} kg CO₂e / kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                          <span className="text-slate-600">Total CO₂e emissions:</span>
                          <span className="font-semibold text-slate-900">
                            {canonicalData.total_indirect_emissions_tco2?.toFixed(2)} tCO₂e
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="font-medium">No data available</p>
                  <p className="text-sm mt-1">Upload documents to view compliance details</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right Rail - Compliance Status & Actions */}
      <div className="w-80 border-l border-slate-200 bg-white p-6 overflow-auto">
        {/* Compliance Status Card */}
        <Card className="mb-6" padding="md">
          <CardHeader
            title="Compliance Status"
            action={
              <Badge variant={canExport ? 'success' : 'danger'}>
                {canExport ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Compliant
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Not Compliant
                  </>
                )}
              </Badge>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {/* Direct Emissions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Direct emissions</span>
                  <Badge variant={directComplete ? 'success' : 'danger'} size="sm">
                    {directComplete ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Compliant
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Not compliant
                      </>
                    )}
                  </Badge>
                </div>
                <Progress 
                  value={directComplete ? 100 : 75} 
                  variant={directComplete ? 'success' : 'danger'} 
                />
                <p className="text-xs text-slate-500 mt-1">{directComplete ? '100' : '75'}% complete</p>
              </div>

              {/* Indirect Emissions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Indirect emissions</span>
                  <Badge variant={indirectComplete ? 'success' : 'warning'} size="sm">
                    {indirectComplete ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Compliant
                      </>
                    ) : 'In Progress'}
                  </Badge>
                </div>
                <Progress 
                  value={indirectComplete ? 100 : (extractedDocs.length / Math.max(documents.length, 1)) * 100} 
                  variant={indirectComplete ? 'success' : 'default'} 
                />
                <p className="text-xs text-slate-500 mt-1">
                  {indirectComplete ? '100' : Math.round((extractedDocs.length / Math.max(documents.length, 1)) * 100)}% complete
                </p>
              </div>

              {/* Annual Verification */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Annual Verification | Eurocert S.A.</span>
                  <Badge variant={verificationComplete ? 'success' : 'neutral'} size="sm">
                    {verificationComplete ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Compliant
                      </>
                    ) : 'Pending'}
                  </Badge>
                </div>
                <Progress 
                  value={verificationComplete ? 100 : 0} 
                  variant={verificationComplete ? 'success' : 'default'} 
                />
                <p className="text-xs text-slate-500 mt-1">{verificationComplete ? '100' : '0'}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}
