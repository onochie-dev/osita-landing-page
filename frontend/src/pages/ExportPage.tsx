import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCode,
  Package,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '../lib/cn'
import { projectsApi } from '../api/projects'
import { exportsApi } from '../api/exports'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export default function ExportPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [activeTab, setActiveTab] = useState<'excel' | 'xml' | 'zip'>('excel')
  const [xmlContent, setXmlContent] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const { data: validationResult } = useQuery({
    queryKey: ['validation', projectId],
    queryFn: () => projectsApi.validate(projectId!),
    enabled: !!projectId,
  })

  const { data: exportHistory } = useQuery({
    queryKey: ['exportHistory', projectId],
    queryFn: () => exportsApi.getHistory(projectId!),
    enabled: !!projectId,
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

  const canExport = validationResult?.can_export ?? false

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
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link to="/" className="hover:text-slate-700 transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/project/${projectId}`} className="hover:text-slate-700 transition-colors">
              {project?.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Export</span>
          </div>

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
                'mb-8',
                canExport ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
              )}
              padding="md"
            >
              <div className="flex items-center gap-4">
                {canExport ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                )}
                <div className="flex-1">
                  <p className={cn('font-medium', canExport ? 'text-emerald-800' : 'text-red-800')}>
                    {canExport ? 'Ready for Export' : 'Review Required Before Export'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {validationResult.blocking_count} blocking · {validationResult.warning_count} warnings · {validationResult.info_count} info
                  </p>
                </div>
                {!canExport && (
                  <Link to={`/project/${projectId}`}>
                    <Button variant="secondary" size="sm">
                      Review Issues
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </motion.div>
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
            <motion.div key={id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={cn(
                  'cursor-pointer transition-all h-full',
                  activeTab === id && 'ring-2 ring-slate-400 border-slate-400',
                  !canExport && 'opacity-50 cursor-not-allowed'
                )}
                padding="md"
                onClick={() => {
                  if (canExport) {
                    setActiveTab(id as typeof activeTab)
                    action()
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    activeTab === id ? 'bg-slate-800' : 'bg-slate-100'
                  )}>
                    {isLoading ? (
                      <Loader2 className={cn(
                        'w-6 h-6 animate-spin',
                        activeTab === id ? 'text-white' : 'text-slate-500'
                      )} />
                    ) : (
                      <Icon className={cn(
                        'w-6 h-6',
                        activeTab === id ? 'text-white' : 'text-slate-500'
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
