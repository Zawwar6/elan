import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { useToast } from '../context/ToastContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import EmptyState from '../components/common/EmptyState'
import { calculateCartTotals } from '../utils/helpers'
import { SITE_CONFIG } from '../config/siteConfig'

export default function Cart() {
  const { items } = useCart()
  const { validateCoupon } = useProducts()
  const toast = useToast()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const rawSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  function handleApplyCoupon(e) {
    e.preventDefault()
    if (!couponCode.trim()) return
    const result = validateCoupon(couponCode, rawSubtotal)
    if (!result.valid) {
      toast.show(result.message, 'error')
      return
    }
    setAppliedCoupon(result.coupon)
    toast.show('Coupon applied.', 'success')
  }

  const totals = calculateCartTotals(items, { couponDiscountPercent: appliedCoupon?.discountPercent || 0 })

  if (items.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore the collection to find something you'll love."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
          ))}
        </div>
        <div>
          <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="input-field"
            />
            <button type="submit" className="btn-secondary px-5 whitespace-nowrap">Apply</button>
          </form>
          {appliedCoupon && (
            <p className="text-xs text-accent mb-4">
              "{appliedCoupon.code}" applied — {appliedCoupon.discountPercent}% off.
            </p>
          )}
          <CartSummary
            subtotal={totals.subtotal}
            couponDiscount={totals.couponDiscount}
            shipping={totals.shipping}
            total={totals.total}
            freeShippingThreshold={SITE_CONFIG.freeShippingThreshold}
          >
            <button
              onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code } })}
              className="btn-primary w-full mt-5"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center text-sm text-accent mt-3 hover:underline">
              Continue Shopping
            </Link>
          </CartSummary>
        </div>
      </div>
    </div>
  )
}
