import { Link } from 'react-router-dom'
import { X, User, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { SITE_CONFIG } from '../../config/siteConfig'

export default function MobileDrawer({ open, onClose, links }) {
  const { isAuthenticated } = useAuth()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/40 animate-fadeIn" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-ivory shadow-xl animate-slideInRight flex flex-col">
        <div className="flex items-center justify-between px-5 h-20 border-b border-line">
          <span className="text-xl font-display tracking-widest">{SITE_CONFIG.brandName}</span>
          <button onClick={onClose} aria-label="Close menu" className="p-2 text-ink hover:text-accent">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={onClose}
              className="px-5 py-3.5 text-base text-ink border-b border-line/60 hover:bg-stone"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/shop" onClick={onClose} className="px-5 py-3.5 text-base text-ink border-b border-line/60 hover:bg-stone">
            Shop All
          </Link>
        </nav>
        <div className="mt-auto p-5 border-t border-line flex flex-col gap-3">
          <Link to={isAuthenticated ? '/account' : '/login'} onClick={onClose} className="flex items-center gap-2 text-sm text-ink hover:text-accent">
            <User size={18} /> {isAuthenticated ? 'My Account' : 'Sign In'}
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex items-center gap-2 text-sm text-ink hover:text-accent">
            <Heart size={18} /> Wishlist
          </Link>
        </div>
      </div>
    </div>
  )
}
