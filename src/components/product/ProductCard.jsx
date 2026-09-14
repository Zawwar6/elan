import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye } from 'lucide-react'
import ImageWithFallback from '../common/ImageWithFallback'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import { formatCurrency, calculateDiscountedPrice } from '../../utils/helpers'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductCard({ product, onQuickView }) {
  const [hovered, setHovered] = useState(false)
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const finalPrice = calculateDiscountedPrice(product.price, product.discount)
  const outOfStock = product.stock <= 0

  return (
    <div
      className="group relative animate-fadeIn"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-stone">
        <ImageWithFallback
          src={hovered && product.images?.[1] ? product.images[1] : product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && <Badge tone="new">New</Badge>}
          {product.discount > 0 && <Badge tone="sale">-{product.discount}%</Badge>}
          {outOfStock && <Badge tone="out">Out of Stock</Badge>}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors"
        >
          <Heart size={16} className={wishlisted ? 'fill-accent text-accent' : 'text-ink'} />
        </button>
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onQuickView(product)
            }}
            className="absolute bottom-0 inset-x-0 bg-ink text-ivory text-xs tracking-wide py-2.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Eye size={14} /> Quick View
          </button>
        )}
      </Link>

      <div className="mt-3">
        <p className="text-xs text-ink-soft uppercase tracking-wide">{product.category}</p>
        <Link to={`/product/${product.id}`} className="block text-sm text-ink hover:text-accent mt-0.5 line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{formatCurrency(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-ink-soft line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
        {product.reviewCount > 0 && <div className="mt-1"><Rating value={product.rating} count={product.reviewCount} size={12} /></div>}
      </div>
    </div>
  )
}
