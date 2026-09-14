import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { getOrders } from '../utils/storage'
import { formatCurrency, formatDate } from '../utils/helpers'
import Loader from '../components/common/Loader'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(undefined)

  useEffect(() => {
    getOrders().then((orders) => {
      setOrder(orders.find((o) => o.id === orderId) || null)
    })
  }, [orderId])

  if (order === undefined) return <Loader />
  if (order === null) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink-soft mb-4">We couldn't find that order.</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-page py-16 max-w-2xl">
      <div className="text-center mb-10">
        <CheckCircle2 size={48} className="text-accent mx-auto mb-4" />
        <h1 className="font-display text-3xl mb-2">Thank you, {order.customer.fullName.split(' ')[0]}.</h1>
        <p className="text-ink-soft">Your order has been placed. A confirmation has been sent to {order.customer.email}.</p>
        <p className="text-sm text-ink mt-3">Order ID: <span className="font-medium">{order.id}</span></p>
      </div>

      <div className="bg-stone p-6 mb-6">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-ink-soft">Placed on</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="space-y-3 mb-4">
          {order.items.map((i) => (
            <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between text-sm">
              <span className="text-ink-soft">{i.name} ({i.size}/{i.color}) × {i.quantity}</span>
              <span>{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-base font-medium border-t border-line/70 pt-4">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 text-sm mb-10">
        <div>
          <h3 className="text-ink-soft mb-1">Shipping to</h3>
          <p>{order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
        </div>
        <div>
          <h3 className="text-ink-soft mb-1">Payment method</h3>
          <p className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Card' : 'Bank Transfer'}</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
        <Link to="/account/orders" className="btn-primary">View Order History</Link>
      </div>
    </div>
  )
}
