import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useProducts } from '../context/ProductContext'
import ProductGrid from '../components/product/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'

export default function Wishlist() {
  const { productIds } = useWishlist()
  const { products, loading } = useProducts()

  if (loading) return <Loader />
  const wishlistProducts = products.filter((p) => productIds.includes(p.id))

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save the pieces you love here so you can find them again easily."
          actionLabel="Explore the Shop"
          actionTo="/shop"
        />
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </div>
  )
}
