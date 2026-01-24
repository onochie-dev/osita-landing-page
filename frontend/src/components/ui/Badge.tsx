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
      success: 'bg-osita-900 text-white',
      danger: 'bg-red-50 text-red-600 border border-red-100',
      warning: 'bg-amber-50 text-amber-700 border border-amber-100',
      info: 'bg-osita-100 text-osita-700 border border-osita-200/80',
      neutral: 'bg-osita-100 text-osita-600 border border-osita-200/60',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-[11px] tracking-wide',
      md: 'px-2.5 py-1 text-caption',
    }

    const dotColors = {
      success: 'bg-white',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-osita-500',
      neutral: 'bg-osita-400',
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
