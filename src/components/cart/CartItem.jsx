import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, Heart } from 'lucide-react'
import ImageWithFallback from '../common/ImageWithFallback'
import { formatCurrency } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const { toggleWishlist } = useWishlist()

  return (
    <div className="flex gap-4 py-6 border-b border-line">
      <Link to={`/product/${item.productId}`} className="shrink-0">
        <ImageWithFallback src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-stone" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${item.productId}`} className="text-sm text-ink hover:text-accent">{item.name}</Link>
            <p className="text-xs text-ink-soft mt-1">Size: {item.size} · Color: {item.color}</p>
            <p className="text-sm text-ink mt-2">{formatCurrency(item.price)}</p>
          </div>
          <button onClick={() => removeItem(item.productId, item.size, item.color)} aria-label="Remove item" className="text-ink-soft hover:text-sale shrink-0">
            <Trash2 size={17} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-line">
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => {
              toggleWishlist(item.productId)
              removeItem(item.productId, item.size, item.color)
            }}
            className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-accent"
          >
            <Heart size={14} /> Move to wishlist
          </button>
        </div>
        {item.quantity >= item.stock && (
          <p className="text-xs text-amber-700 mt-2">Max available stock reached.</p>
        )}
      </div>
    </div>
  )
}
