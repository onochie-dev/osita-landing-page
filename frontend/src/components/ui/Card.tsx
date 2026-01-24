import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300 ease-smooth'

    const variantStyles = {
      default: cn(
        'bg-white border border-osita-200/80',
        'shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.02)]'
      ),
      bordered: 'bg-white border-2 border-osita-200',
      elevated: cn(
        'bg-white',
        'shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),0_2px_6px_-2px_rgba(0,0,0,0.04)]'
      ),
    }

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const hoverStyles = hover
      ? cn(
          'cursor-pointer',
          'hover:border-osita-300',
          'hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_4px_8px_-4px_rgba(0,0,0,0.03)]',
          'hover:-translate-y-0.5'
        )
      : ''

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between', className)}
        {...props}
      >
        {(title || description) ? (
          <div>
            {title && <h3 className="text-title text-osita-900">{title}</h3>}
            {description && <p className="text-body-sm text-osita-500 mt-1">{description}</p>}
          </div>
        ) : children}
        {action && <div>{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('mt-5', className)} {...props} />
  }
)

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6 pt-5 border-t border-osita-100 flex items-center', className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }
