import { Outlet } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-stone/40">
      <AdminSidebar />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
