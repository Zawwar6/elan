import { useMemo, useState } from 'react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import ImageWithFallback from '../../components/common/ImageWithFallback'

/**
 * Controls which products surface in the homepage's Featured / New
 * Arrivals / Best Sellers rails by toggling the same flags used on
 * the product form — this page is just a faster, bulk-friendly view
 * of that data, scoped to what the homepage actually reads.
 */
export default function AdminHomepage() {
  const { products, updateProduct } = useProducts()
  const toast = useToast()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return products
    const q = query.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  async function toggle(product, field) {
    await updateProduct(product.id, { [field]: !product[field] })
    toast.show('Homepage updated.', 'success')
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Homepage</h1>
      <p className="text-sm text-ink-soft mb-6">Choose which products appear in the Featured, New Arrivals, and Best Sellers sections on the homepage.</p>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input-field max-w-sm mb-5" />

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Product</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-center">New Arrival</th>
              <th className="p-4 text-center">Best Seller</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                <td className="p-4 flex items-center gap-3">
                  <ImageWithFallback src={p.images?.[0]} alt={p.name} className="w-10 h-12 object-cover bg-stone" />
                  {p.name}
                </td>
                {['featured', 'newArrival', 'bestSeller'].map((field) => (
                  <td key={field} className="p-4 text-center">
                    <input type="checkbox" checked={p[field]} onChange={() => toggle(p, field)} className="accent-accent w-4 h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
