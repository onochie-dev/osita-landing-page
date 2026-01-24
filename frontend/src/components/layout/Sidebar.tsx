import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Settings, HelpCircle, ChevronDown, LogOut, LogIn, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useAuth } from '../../stores/authStore'
import { projectsApi } from '../../api/projects'

export function Sidebar() {
  const { profile, isAuthenticated, isLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Extract projectId from URL if we're in a project view
  const projectIdMatch = location.pathname.match(/\/project\/([^/]+)/)
  const currentProjectId = projectIdMatch ? projectIdMatch[1] : null

  // Fetch current project data if we're in a project
  const { data: currentProject } = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => projectsApi.get(currentProjectId!),
    enabled: !!currentProjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

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

  // Navigate to settings with project context if applicable
  const handleSettingsClick = () => {
    if (currentProject) {
      navigate('/settings', {
        state: {
          fromProject: {
            id: currentProject.id,
            name: currentProject.name,
          }
        }
      })
    } else {
      navigate('/settings')
    }
  }

  // Get display name - fallback to email if username not available
  const displayName = profile?.username || profile?.email?.split('@')[0] || 'User'
  const displayEmail = profile?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex flex-col min-h-screen relative overflow-hidden dark-scrollbar">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* User Profile / Login Section */}
      <div className="relative p-5 border-b border-sidebar-border/60">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-hover flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-sidebar-muted animate-spin" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-24 bg-sidebar-hover rounded-md animate-pulse" />
              <div className="h-3 w-32 bg-sidebar-hover/50 rounded-md animate-pulse" />
            </div>
          </div>
        ) : isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center gap-3 hover:bg-sidebar-hover rounded-xl p-2 -m-2 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center ring-2 ring-white/10">
                <span className="text-sidebar-bg font-semibold text-sm">
                  {initials}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-white/95 truncate text-[15px]">{displayName}</p>
                <p className="text-xs text-sidebar-muted truncate">{displayEmail}</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-sidebar-muted transition-transform duration-200",
                showDropdown && "rotate-180"
              )} />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-sidebar-hover border border-sidebar-border rounded-xl shadow-elevated overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-sidebar-border/60">
                  <p className="text-[10px] text-sidebar-muted uppercase tracking-wider font-medium">Signed in as</p>
                  <p className="text-sm text-white/90 font-medium truncate mt-0.5">{displayEmail}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-muted hover:text-white hover:bg-sidebar-active rounded-lg transition-all duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-sidebar-hover transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-sidebar-hover flex items-center justify-center ring-1 ring-sidebar-border">
              <LogIn className="w-5 h-5 text-sidebar-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white/95 text-[15px]">Sign in</p>
              <p className="text-xs text-sidebar-muted">Access your account</p>
            </div>
          </Link>
        )}
      </div>

      {/* Period Selector */}
      <div className="relative p-4 space-y-2">
        <button className="w-full flex items-center justify-between px-4 py-3.5 bg-sidebar-hover/80 border border-sidebar-border/40 rounded-xl hover:bg-sidebar-hover hover:border-sidebar-border/60 transition-all duration-200 group">
          <div className="text-left">
            <p className="text-[10px] text-sidebar-muted uppercase tracking-wider font-medium mb-0.5">Current Period</p>
            <p className="text-sm text-white/90 font-medium">Q1 2026</p>
          </div>
          <ChevronDown className="w-4 h-4 text-sidebar-muted group-hover:text-white/60 transition-colors" />
        </button>

        <button className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-sidebar-border/20 rounded-xl hover:bg-sidebar-hover/50 hover:border-sidebar-border/40 transition-all duration-200 group">
          <span className="text-sm text-sidebar-muted group-hover:text-white/70 transition-colors">Historical Filings</span>
          <ChevronDown className="w-4 h-4 text-sidebar-muted/60 group-hover:text-sidebar-muted transition-colors" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Navigation */}
      <div className="relative p-4 border-t border-sidebar-border/40 space-y-1">
        <button
          onClick={handleSettingsClick}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
            location.pathname === '/settings' && 'bg-sidebar-active text-white',
            location.pathname !== '/settings' && 'text-sidebar-muted hover:text-white hover:bg-sidebar-hover'
          )}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sidebar-muted/40 cursor-not-allowed"
        >
          <HelpCircle className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">Help</span>
        </div>
      </div>

      {/* Brand footer */}
      <div className="relative px-5 py-4 border-t border-sidebar-border/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
            <span className="text-sidebar-bg font-bold text-xs">O</span>
          </div>
          <span className="text-[13px] font-medium text-white/50">OSITA</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
