import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileCode,
  Package,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { projectsApi } from '../api/projects'
import { exportsApi } from '../api/exports'

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-osita-500" />
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-midnight-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/project/${projectId}`} className="hover:text-white transition-colors">
              {project?.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Export</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={`/project/${projectId}`}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-white">Export Report</h1>
              <p className="text-sm text-gray-500 mt-1">
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
            className={clsx(
              'p-4 rounded-xl border mb-8 flex items-center gap-4',
              canExport
                ? 'bg-osita-500/10 border-osita-500/20'
                : 'bg-coral-500/10 border-coral-500/20'
            )}
          >
            {canExport ? (
              <Zap className="w-6 h-6 text-osita-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-coral-400" />
            )}
            <div>
              <p className={clsx('font-medium', canExport ? 'text-osita-400' : 'text-coral-400')}>
                {canExport ? 'Ready for Export' : 'Review Required Before Export'}
              </p>
              <p className="text-sm text-gray-400">
                {validationResult.blocking_count} blocking · {validationResult.warning_count} warnings · {validationResult.info_count} info
              </p>
            </div>
            {!canExport && (
              <Link to={`/project/${projectId}`} className="ml-auto btn btn-secondary text-sm">
                Review Issues
              </Link>
            )}
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
            <motion.button
              key={id}
              onClick={() => {
                setActiveTab(id as typeof activeTab)
                action()
              }}
              disabled={!canExport || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'card p-6 text-left transition-all',
                activeTab === id && 'ring-2 ring-osita-500/50 border-osita-500/30',
                !canExport && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  activeTab === id ? 'bg-osita-500/20' : 'bg-white/5'
                )}>
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-osita-400" />
                  ) : (
                    <Icon className={clsx(
                      'w-6 h-6',
                      activeTab === id ? 'text-osita-400' : 'text-gray-400'
                    )} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* XML Preview */}
        {activeTab === 'xml' && xmlContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-midnight-900/50">
              <h3 className="font-medium text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-osita-400" />
                XML Preview
              </h3>
              <button onClick={copyXml} className="btn btn-secondary text-sm">
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
              </button>
            </div>
            <div className="p-4 max-h-[500px] overflow-auto">
              <pre className="xml-display text-gray-300">{xmlContent}</pre>
            </div>
          </motion.div>
        )}

        {/* Export History */}
        {exportHistory && exportHistory.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Export History
            </h3>
            <div className="space-y-2">
              {exportHistory.map((record) => (
                <div
                  key={record.id}
                  className="card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {record.format === 'excel' && <FileSpreadsheet className="w-5 h-5 text-green-400" />}
                    {record.format === 'xml' && <FileCode className="w-5 h-5 text-blue-400" />}
                    {record.format === 'zip' && <Package className="w-5 h-5 text-purple-400" />}
                    <div>
                      <p className="font-medium text-white">{record.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.generated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded">
                    {record.format.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        {project?.canonical_data && (
          <div className="mt-12 card p-6">
            <h3 className="text-lg font-medium text-white mb-6">Export Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Reporting Period</p>
                <p className="text-xl font-semibold text-white mt-1">
                  {project.canonical_data.reporting_period || '-'} {project.canonical_data.reporting_year || ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Electricity</p>
                <p className="text-xl font-semibold text-white mt-1">
                  {project.canonical_data.total_electricity_mwh?.toFixed(3) || '0'} <span className="text-sm text-gray-400">MWh</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Indirect Emissions</p>
                <p className="text-xl font-semibold text-osita-400 mt-1">
                  {project.canonical_data.total_indirect_emissions_tco2?.toFixed(3) || '0'} <span className="text-sm">tCO₂</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Documents</p>
                <p className="text-xl font-semibold text-white mt-1">
                  {project.documents?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

