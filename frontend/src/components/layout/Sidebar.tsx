import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Settings, HelpCircle, ChevronDown, LogOut, LogIn, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useAuth } from '../../stores/authStore'

export function Sidebar() {
  const { profile, isAuthenticated, isLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setShowDropdown(false)
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      {/* User Profile / Login Section */}
      <div className="p-5 border-b border-slate-800">
        {isLoading ? (
          // Loading state
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-800 rounded animate-pulse mt-1" />
            </div>
          </div>
        ) : isAuthenticated && profile ? (
          // Logged in state
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center gap-3 hover:bg-slate-800/50 rounded-lg p-1 -m-1 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-white truncate">{profile.username}</p>
                <p className="text-xs text-slate-400 truncate">{profile.email}</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                showDropdown && "rotate-180"
              )} />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Signed in as</p>
                  <p className="text-sm text-white font-medium truncate">{profile.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Logged out state
          <Link
            to="/login"
            className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white">Sign in</p>
              <p className="text-xs text-slate-400">Access your account</p>
            </div>
          </Link>
        )}
      </div>

      {/* Period Selector */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
          <span className="text-sm text-slate-300">Current Period — Q1 2026</span>
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
        <NavItem to="/settings" icon={Settings}>
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
