import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle,
  Zap
} from 'lucide-react'
import clsx from 'clsx'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-midnight-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-midnight-900/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-osita-500 to-osita-600 flex items-center justify-center shadow-lg shadow-osita-500/20 group-hover:shadow-osita-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Osita</h1>
              <p className="text-xs text-gray-500">CBAM Filing Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/" icon={LayoutDashboard} active={location.pathname === '/'}>
            Dashboard
          </NavLink>
          <NavLink 
            to="/docs" 
            icon={FileText} 
            active={location.pathname.startsWith('/docs')}
            disabled
          >
            Documentation
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <NavLink to="/settings" icon={Settings} disabled>
            Settings
          </NavLink>
          <NavLink to="/help" icon={HelpCircle} disabled>
            Help & Support
          </NavLink>
        </div>

        {/* Version */}
        <div className="p-4 text-center">
          <span className="text-xs text-gray-600">v0.1.0 (MVP)</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
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
  const content = (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        active && 'bg-osita-500/10 text-osita-400',
        !active && !disabled && 'text-gray-400 hover:text-white hover:bg-white/5',
        disabled && 'text-gray-600 cursor-not-allowed opacity-50'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </div>
  )

  if (disabled) {
    return content
  }

  return <Link to={to}>{content}</Link>
}

