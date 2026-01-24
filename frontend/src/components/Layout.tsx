import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './layout/Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-osita-50 flex">
      {/* Dark Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
