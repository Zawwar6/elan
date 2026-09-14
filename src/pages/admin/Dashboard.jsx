import { useEffect, useMemo, useState } from 'react'
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useProducts } from '../../context/ProductContext'
import { getOrders, getUsers, subscribeToKey, STORAGE_KEYS } from '../../utils/storage'
import { formatCurrency } from '../../utils/helpers'
import StatCard from '../../components/admin/StatCard'
import Loader from '../../components/common/Loader'

const PIE_COLORS = ['#2F3E36', '#4A5D4F', '#8B3A3A', '#C9B896', '#4A4844']

export default function Dashboard() {
  const { products, loading } = useProducts()
  const [orders, setOrders] = useState(undefined)
  const [customerCount, setCustomerCount] = useState(0)

  useEffect(() => {
    async function load() {
      const [o, u] = await Promise.all([getOrders(), getUsers()])
      setOrders(o)
      setCustomerCount(u.length)
    }
    load()
    const unsub1 = subscribeToKey(STORAGE_KEYS.ORDERS, load)
    const unsub2 = subscribeToKey(STORAGE_KEYS.USERS, load)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const stats = useMemo(() => {
    if (!orders) return null
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
    return { totalSales, pendingOrders, lowStock }
  }, [orders, products])

  const salesByDay = useMemo(() => {
    if (!orders) return []
    const map = {}
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      map[day] = (map[day] || 0) + o.total
    })
    return Object.entries(map).map(([day, total]) => ({ day, total })).slice(-14)
  }, [orders])

  const ordersByDay = useMemo(() => {
    if (!orders) return []
    const map = {}
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      map[day] = (map[day] || 0) + 1
    })
    return Object.entries(map).map(([day, count]) => ({ day, count })).slice(-14)
  }, [orders])

  const topProducts = useMemo(() => {
    if (!orders) return []
    const map = {}
    orders.forEach((o) => o.items.forEach((i) => { map[i.name] = (map[i.name] || 0) + i.quantity }))
    return Object.entries(map).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [orders])

  const categoryPerformance = useMemo(() => {
    if (!orders) return []
    const map = {}
    orders.forEach((o) =>
      o.items.forEach((i) => {
        const product = products.find((p) => p.id === i.productId)
        const cat = product?.category || 'Other'
        map[cat] = (map[cat] || 0) + i.quantity * i.price
      })
    )
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [orders, products])

  if (loading || !stats) return <Loader />

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Sales" value={formatCurrency(stats.totalSales)} icon={DollarSign} />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard label="Total Products" value={products.length} icon={Package} />
        <StatCard label="Total Customers" value={customerCount} icon={Users} />
        <StatCard label="Low Stock" value={stats.lowStock} icon={AlertTriangle} tone="warning" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} tone="danger" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-line p-5">
          <h3 className="text-sm text-ink-soft mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesByDay}>
              <CartesianGrid stroke="#E2DCD1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#4A4844" />
              <YAxis tick={{ fontSize: 11 }} stroke="#4A4844" />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="total" stroke="#2F3E36" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-line p-5">
          <h3 className="text-sm text-ink-soft mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersByDay}>
              <CartesianGrid stroke="#E2DCD1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#4A4844" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} stroke="#4A4844" />
              <Tooltip />
              <Bar dataKey="count" fill="#4A5D4F" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-line p-5">
          <h3 className="text-sm text-ink-soft mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid stroke="#E2DCD1" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} stroke="#4A4844" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} stroke="#4A4844" />
              <Tooltip />
              <Bar dataKey="qty" fill="#2F3E36" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-line p-5">
          <h3 className="text-sm text-ink-soft mb-4">Category Performance</h3>
          {categoryPerformance.length === 0 ? (
            <p className="text-sm text-ink-soft py-16 text-center">No sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryPerformance} dataKey="value" nameKey="name" outerRadius={80} label={({ name }) => name}>
                  {categoryPerformance.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
