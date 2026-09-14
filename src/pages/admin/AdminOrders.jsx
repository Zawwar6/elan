import { useEffect, useMemo, useState } from 'react'
import { getOrders, saveOrders, subscribeToKey, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency, formatDate, orderStatusTone, ORDER_STATUSES } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/common/Loader'

export default function AdminOrders() {
  const [orders, setOrders] = useState(undefined)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const toast = useToast()

  useEffect(() => {
    const load = () => getOrders().then(setOrders)
    load()
    const unsubscribe = subscribeToKey(STORAGE_KEYS.ORDERS, load)
    return unsubscribe
  }, [])

  const filtered = useMemo(() => {
    if (!orders) return []
    let list = [...orders]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.fullName.toLowerCase().includes(q))
    }
    if (statusFilter) list = list.filter((o) => o.status === statusFilter)
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, query, statusFilter])

  async function updateStatus(orderId, status) {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    setOrders(next)
    await saveOrders(next)
    toast.show(`Order ${orderId} marked as ${status}.`, 'success')
    if (selectedOrder?.id === orderId) setSelectedOrder((prev) => ({ ...prev, status }))
  }

  if (orders === undefined) return <Loader />

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-5">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order ID or customer…" className="input-field flex-1 min-w-[220px]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                <td className="p-4">
                  <button onClick={() => setSelectedOrder(o)} className="text-accent hover:underline">{o.id}</button>
                </td>
                <td className="p-4">{o.customer.fullName}</td>
                <td className="p-4 text-ink-soft">{formatDate(o.createdAt)}</td>
                <td className="p-4 text-ink-soft">{o.items.length}</td>
                <td className="p-4">{formatCurrency(o.total)}</td>
                <td className="p-4 text-ink-soft capitalize">{o.paymentMethod}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-xs px-2 py-1.5 rounded-full border-0 ${orderStatusTone[o.status]}`}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-ink-soft">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto animate-slideUp">
            <h2 className="font-display text-xl mb-1">{selectedOrder.id}</h2>
            <p className="text-xs text-ink-soft mb-4">{formatDate(selectedOrder.createdAt)}</p>
            <div className="text-sm space-y-1 mb-4">
              <p><span className="text-ink-soft">Customer:</span> {selectedOrder.customer.fullName} ({selectedOrder.customer.email})</p>
              <p><span className="text-ink-soft">Phone:</span> {selectedOrder.customer.phone}</p>
              <p><span className="text-ink-soft">Ship to:</span> {selectedOrder.shipping.address}, {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.postalCode}</p>
            </div>
            <div className="space-y-2 border-y border-line py-4 mb-4">
              {selectedOrder.items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between text-sm">
                  <span className="text-ink-soft">{i.name} ({i.size}/{i.color}) × {i.quantity}</span>
                  <span>{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base font-medium mb-5">
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
