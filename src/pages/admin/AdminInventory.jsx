import { useMemo, useState } from 'react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import { getStockStatus } from '../../utils/helpers'

export default function AdminInventory() {
  const { products, updateProduct } = useProducts()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draftStock, setDraftStock] = useState('')

  const filtered = useMemo(() => {
    let list = [...products]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (statusFilter) list = list.filter((p) => getStockStatus(p.stock).tone === statusFilter)
    return list
  }, [products, query, statusFilter])

  function startEdit(product) {
    setEditingId(product.id)
    setDraftStock(String(product.stock))
  }

  async function saveStock(id) {
    const value = Math.max(0, Number(draftStock) || 0)
    await updateProduct(id, { stock: value })
    toast.show('Stock updated.', 'success')
    setEditingId(null)
  }

  const lowStockCount = products.filter((p) => getStockStatus(p.stock).tone === 'low').length
  const outOfStockCount = products.filter((p) => getStockStatus(p.stock).tone === 'out').length

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Inventory</h1>
      <p className="text-sm text-ink-soft mb-6">
        {lowStockCount} low stock · {outOfStockCount} out of stock
      </p>

      <div className="flex flex-wrap gap-3 mb-5">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product or SKU…" className="input-field flex-1 min-w-[220px]" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Statuses</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const status = getStockStatus(p.stock)
              return (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                  <td className="p-4 text-ink">{p.name}</td>
                  <td className="p-4 text-ink-soft">{p.sku}</td>
                  <td className="p-4">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={draftStock}
                          onChange={(e) => setDraftStock(e.target.value)}
                          className="input-field !py-1.5 !px-2 w-20 text-xs"
                        />
                        <button onClick={() => saveStock(p.id)} className="text-xs text-accent hover:underline">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-ink-soft hover:underline">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(p)} className="hover:underline">{p.stock}</button>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        status.tone === 'out' ? 'bg-red-100 text-red-700' : status.tone === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
