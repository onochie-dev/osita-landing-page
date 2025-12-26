import { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
  rightRail?: ReactNode
  userName?: string
  userEmail?: string
  currentPeriod?: string
  className?: string
}

export function AppShell({ 
  children, 
  rightRail,
  userName,
  userEmail,
  currentPeriod,
  className 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left Sidebar */}
      <Sidebar 
        userName={userName} 
        userEmail={userEmail} 
        currentPeriod={currentPeriod} 
      />
      
      {/* Main Content */}
      <main className={cn('flex-1 overflow-auto', className)}>
        {children}
      </main>
      
      {/* Right Rail (optional) */}
      {rightRail && (
        <aside className="w-80 bg-slate-100 border-l border-slate-200 p-6 overflow-auto">
          {rightRail}
        </aside>
      )}
    </div>
  )
}

export default AppShell

