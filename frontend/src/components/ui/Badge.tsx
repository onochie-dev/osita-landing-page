import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full'

    const variantStyles = {
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      danger: 'bg-red-50 text-red-700 border border-red-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      info: 'bg-blue-50 text-blue-700 border border-blue-200',
      neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    }

    const dotColors = {
      success: 'bg-emerald-500',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-blue-500',
      neutral: 'bg-slate-400',
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }

