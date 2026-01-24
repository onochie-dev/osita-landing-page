import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
      'transition-all duration-200 ease-smooth',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      fullWidth && 'w-full'
    )

    const variantStyles = {
      primary: cn(
        'bg-osita-900 text-white',
        'hover:bg-osita-800 active:scale-[0.98]',
        'focus-visible:ring-osita-900/40',
        'shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]'
      ),
      secondary: cn(
        'bg-white text-osita-700 border border-osita-200',
        'hover:bg-osita-50 hover:border-osita-300 active:scale-[0.98]',
        'focus-visible:ring-osita-500/20'
      ),
      ghost: cn(
        'text-osita-600',
        'hover:bg-osita-100 hover:text-osita-900',
        'focus-visible:ring-osita-500/20'
      ),
      danger: cn(
        'bg-red-50 text-red-600 border border-red-100',
        'hover:bg-red-100 hover:border-red-200 active:scale-[0.98]',
        'focus-visible:ring-red-500/20'
      ),
    }

    const sizeStyles = {
      sm: 'px-3.5 py-2 text-body-sm',
      md: 'px-5 py-2.5 text-body-sm',
      lg: 'px-6 py-3.5 text-body',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
