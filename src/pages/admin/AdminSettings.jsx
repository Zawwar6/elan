import { SITE_CONFIG } from '../../config/siteConfig'
import { ADMIN_CONFIG } from '../../config/adminConfig'
import { AlertTriangle } from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-6">Settings</h1>

      <div className="bg-white border border-line p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Store Configuration</h3>
        <p className="text-sm text-ink-soft mb-4">
          These values are read from <code className="bg-stone px-1">src/config/siteConfig.js</code>. Edit that file
          and rebuild to change them — they're intentionally not editable from the browser so a developer always has
          one clear source of truth.
        </p>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-ink-soft">Brand Name</dt><dd className="text-ink">{SITE_CONFIG.brandName}</dd></div>
          <div><dt className="text-ink-soft">Support Email</dt><dd className="text-ink">{SITE_CONFIG.supportEmail}</dd></div>
          <div><dt className="text-ink-soft">Free Shipping Threshold</dt><dd className="text-ink">${SITE_CONFIG.freeShippingThreshold}</dd></div>
          <div><dt className="text-ink-soft">Flat Shipping Rate</dt><dd className="text-ink">${SITE_CONFIG.flatShippingRate}</dd></div>
        </dl>
      </div>

      <div className="bg-white border border-line p-6 mb-6">
        <h3 className="font-display text-lg mb-4">Admin Account</h3>
        <p className="text-sm text-ink-soft">
          Admin email: <span className="text-ink">{ADMIN_CONFIG.email}</span>
        </p>
        <p className="text-sm text-ink-soft mt-2">
          To change the admin password, edit <code className="bg-stone px-1">src/config/adminConfig.js</code> directly — it is never exposed in the browser beyond this email address.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          This admin panel uses frontend-only authentication and browser storage. It is suitable for a client-managed
          prototype or small demo, but should not be treated as secure authentication for a system handling real
          customer or payment data. See README.md for details on migrating to a real backend.
        </p>
      </div>
    </div>
  )
}
