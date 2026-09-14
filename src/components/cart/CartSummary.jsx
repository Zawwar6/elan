import { formatCurrency } from '../../utils/helpers'

export default function CartSummary({ subtotal, couponDiscount, shipping, total, freeShippingThreshold, children }) {
  const remaining = Math.max(0, freeShippingThreshold - subtotal)
  return (
    <div className="bg-stone p-6">
      <h3 className="font-display text-lg mb-4">Order Summary</h3>
      {remaining > 0 ? (
        <p className="text-xs text-ink-soft mb-4">
          Add {formatCurrency(remaining)} more for free shipping.
        </p>
      ) : (
        <p className="text-xs text-accent mb-4">You've unlocked free shipping.</p>
      )}
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="text-ink">{formatCurrency(subtotal)}</dd>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-accent">
            <dt>Coupon discount</dt>
            <dd>-{formatCurrency(couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-soft">Shipping</dt>
          <dd className="text-ink">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</dd>
        </div>
      </dl>
      <div className="flex justify-between mt-4 pt-4 border-t border-line/70 text-base">
        <span className="font-medium">Total</span>
        <span className="font-medium">{formatCurrency(total)}</span>
      </div>
      {children}
    </div>
  )
}
