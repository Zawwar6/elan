import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import { validateProductForm } from '../../utils/validation'
import { slugify } from '../../utils/helpers'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'One Size']

export default function ProductForm({ initialProduct, mode = 'create' }) {
  const { categories, addProduct, updateProduct } = useProducts()
  const toast = useToast()
  const navigate = useNavigate()
  const [imageInput, setImageInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState(
    initialProduct || {
      name: '',
      sku: '',
      category: '',
      subcategory: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: 0,
      sizes: [],
      colors: [],
      stock: '',
      images: [],
      rating: 0,
      featured: false,
      newArrival: false,
      bestSeller: false,
    }
  )

  const activeCategory = categories.find((c) => c.name === form.category)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleSize(size) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }))
  }

  function addColor() {
    if (!colorInput.trim()) return
    setForm((prev) => ({ ...prev, colors: [...prev.colors, colorInput.trim()] }))
    setColorInput('')
  }

  function removeColor(color) {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))
  }

  function addImage() {
    if (!imageInput.trim()) return
    setForm((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }))
    setImageInput('')
  }

  function removeImage(url) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateProductForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.show('Please fix the highlighted fields.', 'error')
      return
    }

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      discount: Number(form.discount) || 0,
      stock: Number(form.stock),
      sku: form.sku.toUpperCase(),
    }

    if (mode === 'edit') {
      await updateProduct(initialProduct.id, payload)
      toast.show('Product updated successfully.', 'success')
    } else {
      await addProduct(payload)
      toast.show('Product added successfully.', 'success')
    }
    navigate('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-line p-6 space-y-4">
          <h3 className="font-display text-lg">Basic Information</h3>
          <div>
            <label className="label-field">Product Name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" />
            {errors.name && <p className="text-xs text-sale mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">SKU</label>
              <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-field" placeholder="ELN-XX-0000" />
              {errors.sku && <p className="text-xs text-sale mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="label-field">Rating (0-5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => set('rating', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="bg-white border border-line p-6 space-y-4">
          <h3 className="font-display text-lg">Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-sale mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="label-field">Subcategory</label>
              <select value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className="input-field" disabled={!activeCategory}>
                <option value="">Select subcategory</option>
                {activeCategory?.subcategories.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line p-6 space-y-4">
          <h3 className="font-display text-lg">Pricing & Stock</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-field">Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" />
              {errors.price && <p className="text-xs text-sale mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="label-field">Original Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Discount (%)</label>
              <input type="number" min="0" max="90" value={form.discount} onChange={(e) => set('discount', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Stock Quantity</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} className="input-field" />
            {errors.stock && <p className="text-xs text-sale mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div className="bg-white border border-line p-6 space-y-4">
          <h3 className="font-display text-lg">Sizes & Colors</h3>
          <div>
            <label className="label-field">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs border ${form.sizes.includes(size) ? 'border-ink bg-ink text-ivory' : 'border-line text-ink'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && <p className="text-xs text-sale mt-1">{errors.sizes}</p>}
          </div>
          <div>
            <label className="label-field">Colors</label>
            <div className="flex gap-2 mb-2">
              <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="e.g. Olive" className="input-field" />
              <button type="button" onClick={addColor} className="btn-secondary px-4"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.colors.map((c) => (
                <span key={c} className="flex items-center gap-1.5 bg-stone px-2.5 py-1 text-xs">
                  {c}
                  <button type="button" onClick={() => removeColor(c)} aria-label={`Remove ${c}`}><X size={12} /></button>
                </span>
              ))}
            </div>
            {errors.colors && <p className="text-xs text-sale mt-1">{errors.colors}</p>}
          </div>
        </div>

        <div className="bg-white border border-line p-6 space-y-4">
          <h3 className="font-display text-lg">Images</h3>
          <p className="text-xs text-ink-soft">
            No backend storage is available, so images are added as URLs (see README &gt; Image Management).
          </p>
          <div className="flex gap-2">
            <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://…" className="input-field" />
            <button type="button" onClick={addImage} className="btn-secondary px-4"><Plus size={16} /></button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {form.images.map((url) => (
              <div key={url} className="relative aspect-square bg-stone">
                <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => (e.target.style.opacity = 0.2)} />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-white/90 p-1"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          {errors.images && <p className="text-xs text-sale mt-1">{errors.images}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-line p-6 space-y-3">
          <h3 className="font-display text-lg mb-1">Status</h3>
          {[
            ['featured', 'Featured'],
            ['newArrival', 'New Arrival'],
            ['bestSeller', 'Best Seller'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="accent-accent" />
              {label}
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button type="submit" className="btn-primary w-full">
            {mode === 'edit' ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost w-full justify-center">
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
