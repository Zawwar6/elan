import { useEffect, useMemo, useState } from 'react'
import { getUsers, getOrders, subscribeToKey, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Loader from '../../components/common/Loader'

export default function AdminCustomers() {
  const [users, setUsers] = useState(undefined)
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const load = () => Promise.all([getUsers(), getOrders()]).then(([u, o]) => { setUsers(u); setOrders(o) })
    load()
    const unsub1 = subscribeToKey(STORAGE_KEYS.USERS, load)
    const unsub2 = subscribeToKey(STORAGE_KEYS.ORDERS, load)
    return () => { unsub1(); unsub2() }
  }, [])

  const rows = useMemo(() => {
    if (!users) return []
    const withStats = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u.id || o.customer.email === u.email)
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)
      return { ...u, orderCount: userOrders.length, totalSpent }
    })
    if (!query) return withStats
    const q = query.toLowerCase()
    return withStats.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, orders, query])

  if (users === undefined) return <Loader />

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Customers</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers…" className="input-field max-w-sm mb-5" />

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                <td className="p-4 text-ink">{u.name}</td>
                <td className="p-4 text-ink-soft">{u.email}</td>
                <td className="p-4 text-ink-soft">{formatDate(u.createdAt)}</td>
                <td className="p-4">{u.orderCount}</td>
                <td className="p-4">{formatCurrency(u.totalSpent)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-ink-soft">No customers registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
