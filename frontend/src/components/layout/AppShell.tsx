import { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
  rightRail?: ReactNode
  className?: string
}

export function AppShell({ 
  children, 
  rightRail,
  className 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-osita-50 flex">
      {/* Left Sidebar - now auth-aware, gets user info from store */}
      <Sidebar />

      {/* Main Content */}
      <main className={cn('flex-1 overflow-auto', className)}>
        {children}
      </main>

      {/* Right Rail (optional) */}
      {rightRail && (
        <aside className="w-80 bg-osita-50 border-l border-osita-200 p-6 overflow-auto">
          {rightRail}
        </aside>
      )}
    </div>
  )
}

export default AppShell
