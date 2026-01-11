import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './layout/Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Dark Left Sidebar - Now auth-aware */}
      <div className="fixed left-0 top-0 bottom-0 z-40">
        <Sidebar />
      </div>

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
