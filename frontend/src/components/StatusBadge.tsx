import clsx from 'clsx'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Loader2,
  FileCheck
} from 'lucide-react'
import type { ProjectStatus, DocumentStatus } from '../types'

interface StatusBadgeProps {
  status: ProjectStatus | DocumentStatus | string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, {
  label: string
  color: string
  bgColor: string
  icon: React.ElementType
  animate?: boolean
}> = {
  // Project statuses
  draft: {
    label: 'Draft',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    icon: Clock,
  },
  needs_review: {
    label: 'Needs Review',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    icon: AlertCircle,
  },
  export_ready: {
    label: 'Export Ready',
    color: 'text-osita-400',
    bgColor: 'bg-osita-500/10',
    icon: CheckCircle,
  },
  exported: {
    label: 'Exported',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: FileCheck,
  },

  // Document statuses
  uploaded: {
    label: 'Uploaded',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    icon: Clock,
  },
  ocr_processing: {
    label: 'OCR Processing',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Loader2,
    animate: true,
  },
  ocr_complete: {
    label: 'OCR Complete',
    color: 'text-osita-400',
    bgColor: 'bg-osita-500/10',
    icon: CheckCircle,
  },
  ocr_failed: {
    label: 'OCR Failed',
    color: 'text-coral-400',
    bgColor: 'bg-coral-500/10',
    icon: XCircle,
  },
  extraction_processing: {
    label: 'Extracting',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Loader2,
    animate: true,
  },
  extraction_complete: {
    label: 'Extracted',
    color: 'text-osita-400',
    bgColor: 'bg-osita-500/10',
    icon: CheckCircle,
  },
  extraction_failed: {
    label: 'Extraction Failed',
    color: 'text-coral-400',
    bgColor: 'bg-coral-500/10',
    icon: XCircle,
  },
  reviewed: {
    label: 'Reviewed',
    color: 'text-osita-400',
    bgColor: 'bg-osita-500/10',
    icon: FileCheck,
  },

  // Validation severity
  info: {
    label: 'Info',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: AlertCircle,
  },
  warning: {
    label: 'Warning',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    icon: AlertCircle,
  },
  blocking: {
    label: 'Blocking',
    color: 'text-coral-400',
    bgColor: 'bg-coral-500/10',
    icon: XCircle,
  },
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    icon: Clock,
  }

  const Icon = config.icon

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        config.color,
        config.bgColor,
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm'
      )}
    >
      <Icon 
        className={clsx(
          size === 'sm' && 'w-3.5 h-3.5',
          size === 'md' && 'w-4 h-4',
          config.animate && 'animate-spin'
        )} 
      />
      {config.label}
    </span>
  )
}

