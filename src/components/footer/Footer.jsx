import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/category/men' },
      { label: 'Women', to: '/category/women' },
      { label: 'Kids', to: '/category/kids' },
      { label: 'Accessories', to: '/category/accessories' },
      { label: 'Sale', to: '/shop?filter=sale' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Order History', to: '/account/orders' },
      { label: 'Returns', to: '/faq' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-24">
      <div className="container-page py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <span className="text-2xl font-display tracking-[0.15em]">{SITE_CONFIG.brandName}</span>
          <p className="mt-4 text-sm text-ivory/60 max-w-xs">{SITE_CONFIG.tagline}</p>
          <a
            href={SITE_CONFIG.socials.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex mt-5 text-ivory/70 hover:text-ivory"
          >
            <Instagram size={18} />
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm tracking-wide mb-4 text-ivory/90">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ivory/60 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/50">
          <span>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-ivory/80">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
