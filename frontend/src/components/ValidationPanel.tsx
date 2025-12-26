import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle, ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'
import type { ValidationFlag } from '../api/projects'

interface ValidationPanelProps {
  flags: ValidationFlag[]
  blockingCount: number
  warningCount: number
  infoCount: number
  canExport: boolean
}

export default function ValidationPanel({
  flags,
  blockingCount,
  warningCount,
  infoCount,
  canExport,
}: ValidationPanelProps) {
  const severityConfig = {
    blocking: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  }

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      <div
        className={cn(
          'p-4 rounded-2xl border flex items-center justify-between',
          canExport
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        )}
      >
        <div className="flex items-center gap-3">
          {canExport ? (
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          )}
          <div>
            <p className={cn('font-medium', canExport ? 'text-emerald-800' : 'text-red-800')}>
              {canExport ? 'Ready for Export' : 'Review Required'}
            </p>
            <p className="text-sm text-slate-600">
              {blockingCount} blocking · {warningCount} warnings · {infoCount} info
            </p>
          </div>
        </div>
      </div>

      {/* Flag List */}
      {flags.length > 0 && (
        <div className="space-y-2">
          {flags.map((flag, index) => {
            const config = severityConfig[flag.severity]
            const Icon = config.icon

            return (
              <motion.div
                key={`${flag.code}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'p-4 rounded-xl border',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.color)} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('font-medium', config.color)}>
                        {flag.code}
                      </span>
                      <span className="text-xs text-slate-600 px-2 py-0.5 bg-white/50 rounded-full">
                        {flag.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-2">{flag.message}</p>
                    
                    {flag.suggestion && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>{flag.suggestion}</span>
                      </div>
                    )}
                  </div>

                  {(flag.is_resolved || flag.is_acknowledged) && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-slate-600">
                      {flag.is_resolved ? 'Resolved' : 'Acknowledged'}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {flags.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
          <p>No validation issues found</p>
        </div>
      )}
    </div>
  )
}
