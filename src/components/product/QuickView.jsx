import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import ImageWithFallback from '../common/ImageWithFallback'
import Rating from '../common/Rating'
import { formatCurrency, calculateDiscountedPrice } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'

export default function QuickView({ product, onClose }) {
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    if (product) {
      setSize(product.sizes?.[0] || '')
      setColor(product.colors?.[0] || '')
    }
  }, [product])

  if (!product) return null
  const finalPrice = calculateDiscountedPrice(product.price, product.discount)

  function handleAdd() {
    addItem(product, { size, color, quantity: 1 })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50 animate-fadeIn" onClick={onClose} />
      <div className="relative bg-white max-w-3xl w-full grid grid-cols-1 sm:grid-cols-2 max-h-[85vh] overflow-y-auto animate-slideUp">
        <button onClick={onClose} aria-label="Close quick view" className="absolute top-4 right-4 z-10 bg-white/90 p-1.5">
          <X size={18} />
        </button>
        <ImageWithFallback src={product.images?.[0]} alt={product.name} className="w-full h-full min-h-[280px] object-cover" />
        <div className="p-6 sm:p-8">
          <p className="text-xs text-ink-soft uppercase tracking-wide">{product.category} / {product.subcategory}</p>
          <h2 className="font-display text-2xl mt-1">{product.name}</h2>
          <div className="mt-2"><Rating value={product.rating} count={product.reviewCount} /></div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-medium">{formatCurrency(finalPrice)}</span>
            {product.discount > 0 && <span className="text-sm text-ink-soft line-through">{formatCurrency(product.price)}</span>}
          </div>
          <p className="text-sm text-ink-soft mt-4 line-clamp-3">{product.description}</p>

          <div className="mt-5">
            <p className="text-xs text-ink-soft mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-xs border ${size === s ? 'border-ink bg-ink text-ivory' : 'border-line text-ink'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-ink-soft mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-1.5 text-xs border ${color === c ? 'border-ink bg-ink text-ivory' : 'border-line text-ink'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAdd} disabled={product.stock <= 0} className="btn-primary w-full mt-6">
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <Link to={`/product/${product.id}`} onClick={onClose} className="block text-center text-sm text-accent mt-3 hover:underline">
            View full details
          </Link>
        </div>
      </div>
    </div>
  )
}
