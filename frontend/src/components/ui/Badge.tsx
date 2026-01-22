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

    // Black/white theme - success uses black, info uses gray
    const variantStyles = {
      success: 'bg-neutral-900 text-white border border-neutral-800',
      danger: 'bg-red-50 text-red-700 border border-red-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      info: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
      neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    }

    const dotColors = {
      success: 'bg-white',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-neutral-500',
      neutral: 'bg-neutral-400',
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
