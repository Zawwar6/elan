import { SITE_CONFIG } from '../../config/siteConfig'

export default function Privacy() {
  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-ink-soft leading-relaxed">
        <p>
          This is a demonstration storefront. Any information entered — account details, addresses, or payment form
          fields — is stored only in your browser's local storage and is never transmitted to a server, because this
          project has no backend.
        </p>
        <p>
          In a production deployment connected to a real backend, this section would describe what personal data is
          collected, how it is used, who it may be shared with, and how a customer can request its deletion.
        </p>
        <p>Questions about this policy can be sent to {SITE_CONFIG.supportEmail}.</p>
      </div>
    </div>
  )
}
