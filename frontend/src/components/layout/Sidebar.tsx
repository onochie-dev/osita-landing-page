import { Link, useLocation } from 'react-router-dom'
import { Settings, HelpCircle, ChevronDown, User } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SidebarProps {
  userName?: string
  userEmail?: string
  currentPeriod?: string
}

export function Sidebar({ userName = 'John Doe', userEmail = 'johndoe@company.com', currentPeriod = 'Q1 2026' }: SidebarProps) {

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      {/* User Profile */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
          <span className="text-sm text-slate-300">Current Period — {currentPeriod}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
          <span className="text-sm text-slate-400">Historical Quarterly Filings</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavItem to="/settings" icon={Settings} disabled>
          Settings
        </NavItem>
        <NavItem to="/help" icon={HelpCircle} disabled>
          Help
        </NavItem>
      </div>
    </aside>
  )
}

interface NavItemProps {
  to: string
  icon: React.ElementType
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
}

function NavItem({ to, icon: Icon, children, active, disabled }: NavItemProps) {
  const location = useLocation()
  const isActive = active ?? location.pathname === to

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors',
        isActive && 'bg-slate-800 text-white',
        !isActive && !disabled && 'text-slate-400 hover:text-white hover:bg-slate-800/50',
        disabled && 'text-slate-600 cursor-not-allowed'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{children}</span>
    </div>
  )

  if (disabled) {
    return content
  }

  return <Link to={to}>{content}</Link>
}

export default Sidebar

