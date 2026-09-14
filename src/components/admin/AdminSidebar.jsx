import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Users,
  Boxes,
  Ticket,
  MessageSquare,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { SITE_CONFIG } from '../../config/siteConfig'

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const { logout, session } = useAdminAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <>
      <div className="px-6 h-20 flex items-center border-b border-white/10">
        <span className="font-display text-xl tracking-widest text-ivory">{SITE_CONFIG.brandName}</span>
        <span className="ml-2 text-[10px] uppercase tracking-wider text-ivory/50 mt-1">Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive ? 'bg-white/10 text-ivory border-r-2 border-accent-light' : 'text-ivory/60 hover:text-ivory hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="px-2 text-xs text-ivory/40 mb-2 truncate">{session?.email}</p>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 text-sm text-ivory/70 hover:text-ivory rounded"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-ink z-40 flex items-center justify-between px-4">
        <span className="font-display text-lg tracking-widest text-ivory">{SITE_CONFIG.brandName} Admin</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open admin menu" className="text-ivory p-2">
          <Menu size={22} />
        </button>
      </div>
      <div className="lg:hidden h-16" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink flex flex-col animate-slideInRight">
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-ivory/70" aria-label="Close menu">
              <X size={20} />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-ink flex-col z-30">{content}</aside>
    </>
  )
}
