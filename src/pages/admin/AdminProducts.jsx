import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { formatCurrency, getStockStatus } from '../../utils/helpers'

export default function AdminProducts() {
  const { products, categories, deleteProduct } = useProducts()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)

  const filtered = useMemo(() => {
    let list = [...products]
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter)
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'price') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'stock') list.sort((a, b) => a.stock - b.stock)
    return list
  }, [products, query, categoryFilter, sortBy])

  async function confirmDelete() {
    await deleteProduct(pendingDelete.id)
    toast.show('Product deleted successfully.', 'success')
    setPendingDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU…"
            className="input-field pl-9"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto">
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="stock">Sort: Stock</option>
        </select>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const stockStatus = getStockStatus(p.stock)
              return (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                  <td className="p-4">
                    <ImageWithFallback src={p.images?.[0]} alt={p.name} className="w-12 h-14 object-cover bg-stone" />
                  </td>
                  <td className="p-4 max-w-[220px]">
                    <p className="text-ink truncate">{p.name}</p>
                    <p className="text-xs text-ink-soft">{p.sku}</p>
                  </td>
                  <td className="p-4 text-ink-soft">{p.category}</td>
                  <td className="p-4 text-ink">{formatCurrency(p.price)}</td>
                  <td className="p-4 text-ink">{p.stock}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        stockStatus.tone === 'out' ? 'bg-red-100 text-red-700' : stockStatus.tone === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-ink-soft">
                      <button onClick={() => setViewProduct(p)} aria-label="View product" className="hover:text-ink"><Eye size={16} /></button>
                      <Link to={`/admin/products/edit/${p.id}`} aria-label="Edit product" className="hover:text-ink"><Pencil size={16} /></Link>
                      <button onClick={() => setPendingDelete(p)} aria-label="Delete product" className="hover:text-sale"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-ink-soft">No products match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this product?"
        description={pendingDelete ? `"${pendingDelete.name}" will be permanently removed from the catalog.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {viewProduct && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setViewProduct(null)} />
          <div className="relative bg-white max-w-md w-full p-6 animate-slideUp">
            <ImageWithFallback src={viewProduct.images?.[0]} alt={viewProduct.name} className="w-full aspect-[3/4] object-cover bg-stone mb-4" />
            <h3 className="font-display text-xl">{viewProduct.name}</h3>
            <p className="text-sm text-ink-soft mt-1">{viewProduct.sku} · {viewProduct.category} / {viewProduct.subcategory}</p>
            <p className="text-sm mt-3">{formatCurrency(viewProduct.price)} · Stock: {viewProduct.stock}</p>
            <p className="text-sm text-ink-soft mt-3">{viewProduct.description}</p>
            <button onClick={() => setViewProduct(null)} className="btn-secondary w-full mt-5">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
