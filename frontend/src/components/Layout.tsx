import { Outlet, Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, HelpCircle, ChevronDown, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '../lib/cn'
import { projectsApi } from '../api/projects'

export default function Layout() {
  const { projectId } = useParams<{ projectId?: string }>()

  // Get current project for period display
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!),
    enabled: !!projectId,
  })

  const currentPeriod = project 
    ? `${project.reporting_period || 'Q1'} ${project.reporting_year || '2026'}`
    : 'Q1 2026'

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Dark Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0">
        {/* User Profile */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">johndoe@fertilsercompany.ma</p>
            </div>
          </div>
        </div>

        {/* Period Selectors */}
        <div className="p-4 space-y-2">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors text-left">
            <span className="text-sm text-slate-200">Current Period — {currentPeriod}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-colors text-left">
            <span className="text-sm text-slate-400">Historical Quarterly Filings</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <NavLink to="/settings" icon={Settings} disabled>
            Settings
          </NavLink>
          <NavLink to="/help" icon={HelpCircle} disabled>
            Help
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

interface NavLinkProps {
  to: string
  icon: React.ElementType
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
}

function NavLink({ to, icon: Icon, children, active, disabled }: NavLinkProps) {
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
