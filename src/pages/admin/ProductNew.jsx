import ProductForm from '../../components/admin/ProductForm'

export default function ProductNew() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Add Product</h1>
      <ProductForm mode="create" />
    </div>
  )
}
