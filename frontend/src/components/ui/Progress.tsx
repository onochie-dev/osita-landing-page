import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeStyles = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    }

    const variantStyles = {
      default: 'bg-slate-600',
      success: 'bg-emerald-500',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && <span className="text-sm text-slate-600">{label}</span>}
            {showLabel && <span className="text-sm text-slate-500">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizeStyles[size])}>
          <div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', variantStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export { Progress }


