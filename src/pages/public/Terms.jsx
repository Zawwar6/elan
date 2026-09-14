export default function Terms() {
  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-8">Terms & Conditions</h1>
      <div className="space-y-6 text-sm text-ink-soft leading-relaxed">
        <p>
          This storefront is a frontend-only demonstration project. Orders placed here do not result in real
          shipments or charges — there is no backend, payment gateway, or fulfillment system connected to it.
        </p>
        <p>
          By using this demo you acknowledge that all data — accounts, orders, and admin changes — lives in your
          browser's local storage and can be cleared at any time by clearing your browser data.
        </p>
        <p>
          In a production deployment, this page would set out the actual terms governing purchases, shipping,
          returns, and use of the site.
        </p>
      </div>
    </div>
  )
}
