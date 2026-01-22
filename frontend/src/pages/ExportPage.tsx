import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FileSpreadsheet,
  FileCode,
  Package,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '../lib/cn'
import { projectsApi } from '../api/projects'
import { exportsApi } from '../api/exports'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'

export default function ExportPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'excel' | 'xml' | 'zip'>('excel')
  const [xmlContent, setXmlContent] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [showSettingsForm, setShowSettingsForm] = useState(false)

  // Form state for declarant info
  const [declarantName, setDeclarantName] = useState('')
  const [declarantId, setDeclarantId] = useState('')
  const [declarantCountry, setDeclarantCountry] = useState('')

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const { data: validationResult, refetch: refetchValidation } = useQuery({
    queryKey: ['validation', projectId],
    queryFn: () => projectsApi.validate(projectId!),
    enabled: !!projectId,
  })

  const { data: exportHistory } = useQuery({
    queryKey: ['exportHistory', projectId],
    queryFn: () => exportsApi.getHistory(projectId!),
    enabled: !!projectId,
  })

  const updateProjectMutation = useMutation({
    mutationFn: (data: any) => projectsApi.update(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      refetchValidation()
      toast.success('Settings saved!')
      setShowSettingsForm(false)
    },
    onError: () => {
      toast.error('Failed to save settings')
    },
  })

  const previewXmlMutation = useMutation({
    mutationFn: () => exportsApi.previewXml(projectId!),
    onSuccess: (data) => {
      setXmlContent(data.xml)
    },
    onError: () => {
      toast.error('Failed to preview XML')
    },
  })

  const downloadExcelMutation = useMutation({
    mutationFn: () => exportsApi.downloadExcel(projectId!),
    onSuccess: (blob) => {
      downloadBlob(blob, `osita_report_${projectId?.slice(0, 8)}.xlsx`)
      toast.success('Excel downloaded!')
    },
    onError: () => {
      toast.error('Failed to download Excel')
    },
  })

  const downloadZipMutation = useMutation({
    mutationFn: () => exportsApi.downloadZip(projectId!),
    onSuccess: (blob) => {
      downloadBlob(blob, `cbam_package_${projectId?.slice(0, 8)}.zip`)
      toast.success('ZIP package downloaded!')
    },
    onError: () => {
      toast.error('Failed to download ZIP')
    },
  })

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyXml = () => {
    navigator.clipboard.writeText(xmlContent)
    setCopied(true)
    toast.success('XML copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveDeclarant = () => {
    if (!declarantName || !declarantId) {
      toast.error('Please fill in required fields')
      return
    }
    updateProjectMutation.mutate({
      declarant_info: {
        name: declarantName,
        identification_number: declarantId,
        address: declarantCountry ? { country: declarantCountry, city: 'N/A' } : undefined,
      },
    })
  }

  const canExport = validationResult?.can_export ?? false
  const blockingFlags = validationResult?.flags?.filter(f => f.severity === 'blocking') || []
  const warningFlags = validationResult?.flags?.filter(f => f.severity === 'warning') || []

  // Check if missing declarant is a blocking issue
  const missingDeclarant = blockingFlags.some(f => 
    f.message.toLowerCase().includes('declarant') || f.code === 'MISSING_DECLARANT'
  )

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: project?.name || 'Project', href: `/project/${projectId}` },
              { label: 'Export' }
            ]}
          />

          <div className="flex items-center gap-4">
            <Link
              to={`/project/${projectId}`}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Export Report</h1>
              <p className="text-sm text-slate-500 mt-1">
                Download your CBAM report in various formats
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Validation Status Banner */}
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className={cn(
                'mb-6',
                canExport ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
              )}
              padding="md"
            >
              <div className="flex items-center gap-4">
                {canExport ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className={cn('font-medium', canExport ? 'text-emerald-800' : 'text-amber-800')}>
                    {canExport ? 'Ready for Export' : 'Action Required Before Export'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {validationResult.blocking_count} blocking · {validationResult.warning_count} warnings · {validationResult.info_count} info
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blocking Issues - Show inline with fix options */}
        {!canExport && blockingFlags.length > 0 && (
          <Card className="mb-6 border-red-200" padding="md">
            <CardHeader 
              title="Issues Blocking Export" 
              action={
                <Badge variant="danger" size="sm">
                  {blockingFlags.length} blocking
                </Badge>
              }
            />
            <CardContent>
              <div className="space-y-4">
                {blockingFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-800">{flag.message}</p>
                      {flag.suggestion && (
                        <p className="text-sm text-red-600 mt-1">{flag.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Declarant Info Form - Show if that's the blocking issue */}
                {missingDeclarant && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-slate-600" />
                      <h4 className="font-medium text-slate-900">Add Declarant Information</h4>
                    </div>
                    
                    {showSettingsForm ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Company/Person Name *
                            </label>
                            <input
                              type="text"
                              value={declarantName}
                              onChange={(e) => setDeclarantName(e.target.value)}
                              placeholder="e.g., ACME Corporation"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              EORI / ID Number *
                            </label>
                            <input
                              type="text"
                              value={declarantId}
                              onChange={(e) => setDeclarantId(e.target.value)}
                              placeholder="e.g., DE123456789012345"
                              className="w-full font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Country Code (optional)
                          </label>
                          <input
                            type="text"
                            value={declarantCountry}
                            onChange={(e) => setDeclarantCountry(e.target.value.toUpperCase())}
                            placeholder="e.g., DE, FR, MA"
                            maxLength={2}
                            className="w-32 uppercase"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveDeclarant}
                            isLoading={updateProjectMutation.isPending}
                          >
                            Save & Continue
                          </Button>
                          <Button 
                            variant="secondary"
                            onClick={() => setShowSettingsForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setShowSettingsForm(true)}>
                        <User className="w-4 h-4" />
                        Add Declarant Info
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning Issues */}
        {warningFlags.length > 0 && (
          <Card className="mb-6 border-amber-200" padding="md">
            <CardHeader 
              title="Warnings" 
              action={
                <Badge variant="warning" size="sm">
                  {warningFlags.length} warnings
                </Badge>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {warningFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">{flag.message}</p>
                      {flag.suggestion && (
                        <p className="text-xs text-amber-600 mt-1">{flag.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              id: 'excel',
              icon: FileSpreadsheet,
              title: 'Excel Report',
              description: 'Complete report with all data sheets',
              action: () => downloadExcelMutation.mutate(),
              isLoading: downloadExcelMutation.isPending,
            },
            {
              id: 'xml',
              icon: FileCode,
              title: 'XML (CBAM Schema)',
              description: 'Schema-compliant XML for copy/paste',
              action: () => previewXmlMutation.mutate(),
              isLoading: previewXmlMutation.isPending,
            },
            {
              id: 'zip',
              icon: Package,
              title: 'ZIP Package',
              description: 'Complete package for registry upload',
              action: () => downloadZipMutation.mutate(),
              isLoading: downloadZipMutation.isPending,
            },
          ].map(({ id, icon: Icon, title, description, action, isLoading }) => (
            <motion.div key={id} whileHover={{ scale: canExport ? 1.02 : 1 }} whileTap={{ scale: canExport ? 0.98 : 1 }}>
              <Card
                className={cn(
                  'transition-all h-full',
                  canExport ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
                  activeTab === id && canExport && 'ring-2 ring-slate-400 border-slate-400'
                )}
                padding="md"
                onClick={() => {
                  if (canExport) {
                    setActiveTab(id as typeof activeTab)
                    action()
                  } else {
                    toast.error('Please resolve blocking issues first')
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    activeTab === id && canExport ? 'bg-slate-800' : 'bg-slate-100'
                  )}>
                    {isLoading ? (
                      <Loader2 className={cn(
                        'w-6 h-6 animate-spin',
                        activeTab === id && canExport ? 'text-white' : 'text-slate-500'
                      )} />
                    ) : (
                      <Icon className={cn(
                        'w-6 h-6',
                        activeTab === id && canExport ? 'text-white' : 'text-slate-500'
                      )} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* XML Preview */}
        {activeTab === 'xml' && xmlContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-slate-500" />
                  XML Preview
                </h3>
                <Button variant="secondary" size="sm" onClick={copyXml}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy XML
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 max-h-[500px] overflow-auto bg-slate-900">
                <pre className="xml-display text-slate-300">{xmlContent}</pre>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Export History */}
        {exportHistory && exportHistory.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Export History
            </h3>
            <div className="space-y-2">
              {exportHistory.map((record) => (
                <Card key={record.id} padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {record.format === 'excel' && <FileSpreadsheet className="w-5 h-5 text-emerald-500" />}
                      {record.format === 'xml' && <FileCode className="w-5 h-5 text-blue-500" />}
                      {record.format === 'zip' && <Package className="w-5 h-5 text-purple-500" />}
                      <div>
                        <p className="font-medium text-slate-900">{record.filename}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(record.generated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {record.format.toUpperCase()}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        {project?.canonical_data && (
          <Card className="mt-12" padding="lg">
            <CardHeader title="Export Summary" />
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Reporting Period</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {project.canonical_data.reporting_period || '-'} {project.canonical_data.reporting_year || ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Electricity</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {project.canonical_data.total_electricity_mwh?.toFixed(3) || '0'} <span className="text-sm text-slate-400">MWh</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Indirect Emissions</p>
                  <p className="text-xl font-semibold text-emerald-600 mt-1">
                    {project.canonical_data.total_indirect_emissions_tco2?.toFixed(3) || '0'} <span className="text-sm">tCO₂</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Documents</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {project.documents?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
