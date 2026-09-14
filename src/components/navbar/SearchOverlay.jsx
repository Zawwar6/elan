import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { debounce } from '../../utils/helpers'
import ImageWithFallback from '../common/ImageWithFallback'
import { formatCurrency } from '../../utils/helpers'

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { products } = useProducts()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery('')
  }, [open])

  useEffect(() => {
    const search = debounce((q) => {
      if (!q.trim()) return setSuggestions([])
      const lower = q.toLowerCase()
      const matches = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.subcategory.toLowerCase().includes(lower) ||
            p.sku.toLowerCase().includes(lower)
        )
        .slice(0, 5)
      setSuggestions(matches)
    }, 200)
    search(query)
  }, [query, products])

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 animate-fadeIn" onClick={onClose} />
      <div className="relative bg-ivory animate-slideUp">
        <div className="container-page py-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-4 border-b border-ink pb-3">
            <Search size={20} className="text-ink-soft" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, SKUs…"
              className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-ink-soft/50"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="p-1 text-ink-soft hover:text-ink">
              <X size={20} />
            </button>
          </form>

          {suggestions.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`)
                    onClose()
                  }}
                  className="text-left group"
                >
                  <ImageWithFallback src={p.images?.[0]} alt={p.name} className="w-full aspect-[3/4] object-cover bg-stone" />
                  <p className="mt-2 text-sm text-ink group-hover:text-accent line-clamp-2">{p.name}</p>
                  <p className="text-xs text-ink-soft">{formatCurrency(p.price)}</p>
                </button>
              ))}
            </div>
          )}
          {query && suggestions.length === 0 && (
            <p className="mt-6 text-sm text-ink-soft">No products found for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  )
}
