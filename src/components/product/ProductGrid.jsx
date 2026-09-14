import ProductCard from './ProductCard'
import EmptyState from '../common/EmptyState'
import { SearchX } from 'lucide-react'

export default function ProductGrid({ products, onQuickView, emptyMessage = 'No products match your filters.' }) {
  if (products.length === 0) {
    return <EmptyState icon={SearchX} title="Nothing here yet" description={emptyMessage} />
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  )
}
