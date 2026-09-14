import { useParams, Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import ProductForm from '../../components/admin/ProductForm'

export default function ProductEdit() {
  const { id } = useParams()
  const { products } = useProducts()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div>
        <p className="text-ink-soft mb-4">Product not found.</p>
        <Link to="/admin/products" className="btn-primary">Back to Products</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Edit Product</h1>
      <ProductForm mode="edit" initialProduct={product} />
    </div>
  )
}
