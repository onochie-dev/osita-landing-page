import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  projectContext?: {
    id: string
    name: string
  }
}

export function Breadcrumb({ items, projectContext }: BreadcrumbProps) {
  const location = useLocation()

  // Check if we came from a project (via location state or URL pattern)
  const fromProject = projectContext || (location.state as any)?.fromProject

  return (
    <nav className="flex items-center gap-2 text-body-sm">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-osita-500 hover:text-osita-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Projects</span>
      </Link>

      {/* Show project in breadcrumb if we have that context */}
      {fromProject && (
        <>
          <ChevronRight className="w-4 h-4 text-osita-300" />
          <Link
            to={`/project/${fromProject.id}`}
            className="text-osita-500 hover:text-osita-700 transition-colors"
          >
            {fromProject.name}
          </Link>
        </>
      )}

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-osita-300" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-osita-500 hover:text-osita-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-osita-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
