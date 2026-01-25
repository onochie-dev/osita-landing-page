import { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface RightRailProps {
  children: ReactNode
  className?: string
}

export function RightRail({ children, className }: RightRailProps) {
  return (
    <aside className={cn('w-80 p-6 space-y-6', className)}>
      {children}
    </aside>
  )
}

export default RightRail



