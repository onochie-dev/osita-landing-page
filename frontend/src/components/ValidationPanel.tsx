import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
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
      color: 'text-coral-400',
      bgColor: 'bg-coral-500/10',
      borderColor: 'border-coral-500/20',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  }

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      <div
        className={clsx(
          'p-4 rounded-xl border flex items-center justify-between',
          canExport
            ? 'bg-osita-500/10 border-osita-500/20'
            : 'bg-coral-500/10 border-coral-500/20'
        )}
      >
        <div className="flex items-center gap-3">
          {canExport ? (
            <CheckCircle className="w-5 h-5 text-osita-400" />
          ) : (
            <XCircle className="w-5 h-5 text-coral-400" />
          )}
          <div>
            <p className={clsx('font-medium', canExport ? 'text-osita-400' : 'text-coral-400')}>
              {canExport ? 'Ready for Export' : 'Review Required'}
            </p>
            <p className="text-sm text-gray-400">
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
                className={clsx(
                  'p-4 rounded-lg border',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', config.color)} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('font-medium', config.color)}>
                        {flag.code}
                      </span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded">
                        {flag.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">{flag.message}</p>
                    
                    {flag.suggestion && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>{flag.suggestion}</span>
                      </div>
                    )}
                  </div>

                  {(flag.is_resolved || flag.is_acknowledged) && (
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
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
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-osita-500/50" />
          <p>No validation issues found</p>
        </div>
      )}
    </div>
  )
}

