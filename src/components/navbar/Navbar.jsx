import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, Heart, User, ShoppingBag, X } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import MobileDrawer from './MobileDrawer'
import SearchOverlay from './SearchOverlay'

const NAV_LINKS = [
  { label: 'Men', to: '/category/men' },
  { label: 'Women', to: '/category/women' },
  { label: 'Kids', to: '/category/kids' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'Sale', to: '/shop?filter=sale' },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="bg-accent text-ivory text-center text-xs py-2 px-4 tracking-wide">
        Free shipping on orders over ${SITE_CONFIG.freeShippingThreshold} · New season, now live
      </div>

      <header className={`sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b transition-shadow ${scrolled ? 'border-line shadow-sm' : 'border-transparent'}`}>
        <div className="container-page flex items-center justify-between h-20">
          {/* Left */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2 -ml-2 lg:hidden text-ink hover:text-accent"
            >
              <Menu size={22} />
            </button>
            <nav className="hidden lg:flex items-center gap-7 ml-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm tracking-wide transition-colors ${isActive ? 'text-accent' : 'text-ink hover:text-accent'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center */}
          <Link to="/" className="text-2xl font-display tracking-[0.15em] text-ink shrink-0">
            {SITE_CONFIG.brandName}
          </Link>

          {/* Right */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2 text-ink hover:text-accent">
              <Search size={20} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2 text-ink hover:text-accent hidden sm:inline-flex">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              aria-label="Account"
              className="p-2 text-ink hover:text-accent hidden sm:inline-flex"
            >
              <User size={20} />
            </button>
            <Link to="/cart" aria-label="Cart" className="relative p-2 text-ink hover:text-accent">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={NAV_LINKS} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
