import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { CreditCard, Truck, Banknote } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getOrders, saveOrders } from '../utils/storage'
import { validateCheckoutForm } from '../utils/validation'
import { calculateCartTotals, generateOrderId, formatCurrency } from '../utils/helpers'
import { SITE_CONFIG } from '../config/siteConfig'

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'bank', label: 'Bank Transfer', icon: Banknote },
]

export default function Checkout() {
  const { items, clearCart } = useCart()
  const { validateCoupon, redeemCoupon, decrementStockForOrder } = useProducts()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const rawSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const couponCode = location.state?.couponCode
  const couponResult = couponCode ? validateCoupon(couponCode, rawSubtotal) : null
  const totals = calculateCartTotals(items, { couponDiscountPercent: couponResult?.valid ? couponResult.coupon.discountPercent : 0 })

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateCheckoutForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.show('Please fix the highlighted fields.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const orderId = generateOrderId()
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
      }))

      const order = {
        id: orderId,
        userId: user?.id || null,
        customer: { fullName: form.fullName, email: form.email, phone: form.phone },
        shipping: { address: form.address, city: form.city, state: form.state, postalCode: form.postalCode },
        items: orderItems,
        paymentMethod: form.paymentMethod,
        subtotal: totals.subtotal,
        couponCode: couponResult?.valid ? couponResult.coupon.code : null,
        couponDiscount: totals.couponDiscount,
        shipping_cost: totals.shipping,
        total: totals.total,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }

      const existingOrders = await getOrders()
      await saveOrders([order, ...existingOrders])
      await decrementStockForOrder(orderItems)
      if (couponResult?.valid) await redeemCoupon(couponResult.coupon.id)
      clearCart()
      toast.show('Order placed successfully.', 'success')
      navigate(`/order-confirmation/${orderId}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-xl mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Full Name</label>
                <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className="input-field" />
                {errors.fullName && <p className="text-xs text-sale mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" />
                {errors.email && <p className="text-xs text-sale mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Phone</label>
                <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" />
                {errors.phone && <p className="text-xs text-sale mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-field">Address</label>
                <input value={form.address} onChange={(e) => set('address', e.target.value)} className="input-field" />
                {errors.address && <p className="text-xs text-sale mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="label-field">City</label>
                <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" />
                {errors.city && <p className="text-xs text-sale mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="label-field">Province / State</label>
                <input value={form.state} onChange={(e) => set('state', e.target.value)} className="input-field" />
                {errors.state && <p className="text-xs text-sale mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="label-field">Postal Code</label>
                <input value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} className="input-field" />
                {errors.postalCode && <p className="text-xs text-sale mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl mb-4">Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => set('paymentMethod', id)}
                  className={`flex flex-col items-center gap-2 border p-4 text-sm transition-colors ${
                    form.paymentMethod === id ? 'border-ink bg-ink text-ivory' : 'border-line text-ink hover:border-ink'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {form.paymentMethod === 'card' && (
              <div className="bg-stone p-5 space-y-4">
                <p className="text-xs text-ink-soft">
                  Demo only — this is a UI mockup. No real payment is processed since this project has no backend or payment gateway.
                </p>
                <div>
                  <label className="label-field">Card Number</label>
                  <input
                    value={form.cardNumber}
                    onChange={(e) => set('cardNumber', e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="input-field bg-white"
                  />
                  {errors.cardNumber && <p className="text-xs text-sale mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Expiry (MM/YY)</label>
                    <input value={form.cardExpiry} onChange={(e) => set('cardExpiry', e.target.value)} placeholder="09/28" className="input-field bg-white" />
                    {errors.cardExpiry && <p className="text-xs text-sale mt-1">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label className="label-field">CVC</label>
                    <input value={form.cardCvc} onChange={(e) => set('cardCvc', e.target.value)} placeholder="123" className="input-field bg-white" />
                    {errors.cardCvc && <p className="text-xs text-sale mt-1">{errors.cardCvc}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-field">Name on Card</label>
                  <input value={form.cardName} onChange={(e) => set('cardName', e.target.value)} className="input-field bg-white" />
                  {errors.cardName && <p className="text-xs text-sale mt-1">{errors.cardName}</p>}
                </div>
              </div>
            )}

            {form.paymentMethod === 'bank' && (
              <div className="bg-stone p-5 text-sm text-ink-soft">
                Transfer the order total to account <strong className="text-ink">ELAN-DEMO-00192</strong> and use your order ID as the reference. Orders ship once payment is confirmed.
              </div>
            )}
            {form.paymentMethod === 'cod' && (
              <div className="bg-stone p-5 text-sm text-ink-soft">Pay in cash when your order is delivered.</div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-stone p-6">
            <h3 className="font-display text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between text-sm">
                  <span className="text-ink-soft">{i.name} × {i.quantity}</span>
                  <span className="text-ink">{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <dl className="space-y-2.5 text-sm border-t border-line/70 pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd>{formatCurrency(totals.subtotal)}</dd>
              </div>
              {totals.couponDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <dt>Coupon</dt>
                  <dd>-{formatCurrency(totals.couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</dd>
              </div>
            </dl>
            <div className="flex justify-between mt-4 pt-4 border-t border-line/70 text-base font-medium">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
            <p className="text-[11px] text-ink-soft mt-3 text-center">
              By placing your order you agree to {SITE_CONFIG.brandName}'s Terms & Conditions.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
