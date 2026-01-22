import { cn } from '../lib/cn'
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  FileCheck,
} from 'lucide-react'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
  className?: string
}

const statusConfig: Record<string, {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: typeof CheckCircle
  animate?: boolean
}> = {
  // Project statuses
  draft: { label: 'Draft', variant: 'neutral', icon: Clock },
  processing: { label: 'Processing', variant: 'info', icon: Loader2, animate: true },
  export_ready: { label: 'Export Ready', variant: 'success', icon: CheckCircle },
  exported: { label: 'Exported', variant: 'success', icon: FileCheck },
  error: { label: 'Error', variant: 'danger', icon: XCircle },

  // Document statuses
  uploaded: { label: 'Uploaded', variant: 'neutral', icon: Clock },
  ocr_processing: { label: 'OCR Processing', variant: 'info', icon: Loader2, animate: true },
  ocr_complete: { label: 'OCR Complete', variant: 'info', icon: CheckCircle },
  ocr_failed: { label: 'OCR Failed', variant: 'danger', icon: XCircle },
  extraction_processing: { label: 'Extracting', variant: 'info', icon: Loader2, animate: true },
  extraction_complete: { label: 'Extracted', variant: 'success', icon: CheckCircle },
  extraction_failed: { label: 'Extraction Failed', variant: 'danger', icon: XCircle },
  reviewed: { label: 'Reviewed', variant: 'success', icon: FileCheck },
}

const variantStyles = {
  success: 'bg-neutral-900 text-white border-neutral-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.replace(/_/g, ' '),
    variant: 'neutral' as const,
    icon: Clock,
  }

  const Icon = config.icon
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variantStyles[config.variant],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <Icon className={cn(
        size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
        config.animate && 'animate-spin'
      )} />
      {config.label}
    </span>
  )
}
