import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getOrders, subscribeToKey, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency, formatDate, orderStatusTone } from '../../utils/helpers'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState(undefined)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await getOrders()
      setOrders(all.filter((o) => o.userId === user.id || o.customer.email === user.email))
    }
    load()
    const unsubscribe = subscribeToKey(STORAGE_KEYS.ORDERS, load)
    return unsubscribe
  }, [user])

  if (orders === undefined) return <Loader />

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No orders yet" description="Your past orders will show up here once you place one." actionLabel="Start Shopping" actionTo="/shop" />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left border border-line p-5 hover:border-ink transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-ink-soft mt-1">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{formatCurrency(order.total)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${orderStatusTone[order.status]}`}>{order.status}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl">{selectedOrder.id}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full ${orderStatusTone[selectedOrder.status]}`}>{selectedOrder.status}</span>
            </div>
            <p className="text-xs text-ink-soft mb-4">Placed {formatDate(selectedOrder.createdAt)}</p>
            <div className="space-y-3 mb-4 border-y border-line py-4">
              {selectedOrder.items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between text-sm">
                  <span className="text-ink-soft">{i.name} ({i.size}/{i.color}) × {i.quantity}</span>
                  <span>{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base font-medium mb-6">
              <span>Total</span>
              <span>{formatCurrency(selectedOrder.total)}</span>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
