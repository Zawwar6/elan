import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Minus, Plus, Heart, Truck, RotateCcw, Star } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../../context/ToastContext'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import Rating from '../../components/common/Rating'
import Badge from '../../components/common/Badge'
import ProductGrid from '../../components/product/ProductGrid'
import Loader from '../../components/common/Loader'
import { formatCurrency, calculateDiscountedPrice, formatDate } from '../../utils/helpers'
import { SITE_CONFIG } from '../../config/siteConfig'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, reviews, addReview, loading } = useProducts()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const toast = useToast()

  const product = products.find((p) => p.id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState(product?.sizes?.[0] || '')
  const [color, setColor] = useState(product?.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' })

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === id && r.approved),
    [reviews, id]
  )

  if (loading) return <Loader />
  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink-soft mb-4">Product not found.</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const finalPrice = calculateDiscountedPrice(product.price, product.discount)
  const wishlisted = isWishlisted(product.id)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  function handleAddToCart() {
    if (!size || !color) {
      toast.show('Please select a size and color.', 'error')
      return
    }
    addItem(product, { size, color, quantity })
  }

  function handleBuyNow() {
    if (!size || !color) {
      toast.show('Please select a size and color.', 'error')
      return
    }
    addItem(product, { size, color, quantity })
    navigate('/cart')
  }

  function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.show('Please fill out your name and review.', 'error')
      return
    }
    addReview({ productId: product.id, ...reviewForm })
    toast.show('Thanks — your review is pending approval.', 'success')
    setReviewForm({ name: '', rating: 5, comment: '' })
  }

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] bg-stone mb-3">
            <ImageWithFallback src={product.images?.[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {product.images?.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-24 shrink-0 border-2 ${activeImage === i ? 'border-accent' : 'border-transparent'}`}
              >
                <ImageWithFallback src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-ink-soft uppercase tracking-wide">{product.category} / {product.subcategory}</p>
          <h1 className="font-display text-3xl mt-1">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} />
            <span className="text-xs text-ink-soft">SKU: {product.sku}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-medium">{formatCurrency(finalPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-base text-ink-soft line-through">{formatCurrency(product.price)}</span>
                <Badge tone="sale">-{product.discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-ink-soft mt-5 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-sm border ${size === s ? 'border-ink bg-ink text-ivory' : 'border-line text-ink hover:border-ink'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-sm border ${color === c ? 'border-ink bg-ink text-ivory' : 'border-line text-ink hover:border-ink'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-11 flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="w-10 h-11 flex items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
              >
                <Plus size={15} />
              </button>
            </div>
            <span className="text-xs text-ink-soft">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-secondary flex-1">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock <= 0} className="btn-primary flex-1">
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-12 h-12 flex items-center justify-center border border-line shrink-0"
            >
              <Heart size={18} className={wishlisted ? 'fill-accent text-accent' : 'text-ink'} />
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-line pt-6">
            <div className="flex items-start gap-3 text-sm text-ink-soft">
              <Truck size={17} className="shrink-0 mt-0.5" />
              <span>Free shipping on orders over {formatCurrency(SITE_CONFIG.freeShippingThreshold)}. Delivered in 3–6 business days.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-ink-soft">
              <RotateCcw size={17} className="shrink-0 mt-0.5" />
              <span>Free returns within 30 days of delivery, in original condition.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 max-w-2xl">
        <h2 className="font-display text-2xl mb-6">Reviews ({productReviews.length})</h2>
        <div className="space-y-6 mb-10">
          {productReviews.length === 0 && <p className="text-sm text-ink-soft">No reviews yet — be the first.</p>}
          {productReviews.map((r) => (
            <div key={r.id} className="border-b border-line pb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.name}</span>
                <span className="text-xs text-ink-soft">{formatDate(r.date)}</span>
              </div>
              <div className="my-1"><Rating value={r.rating} size={13} /></div>
              <p className="text-sm text-ink-soft">{r.comment}</p>
            </div>
          ))}
        </div>

        <h3 className="font-display text-lg mb-4">Write a review</h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <input
            value={reviewForm.name}
            onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="input-field"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-soft mr-2">Rating</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setReviewForm((f) => ({ ...f, rating: n }))} aria-label={`Rate ${n} stars`}>
                <Star size={20} className={n <= reviewForm.rating ? 'fill-accent text-accent' : 'fill-line text-line'} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            rows={4}
            placeholder="Share your thoughts on fit, fabric, and quality…"
            className="input-field"
          />
          <button type="submit" className="btn-primary">Submit Review</button>
        </form>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl mb-6">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
