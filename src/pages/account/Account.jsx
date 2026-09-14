import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { useProducts } from '../../context/ProductContext'
import { validateAuthForm } from '../../utils/validation'

export default function Account() {
  const { user, logout, updateProfile } = useAuth()
  const { productIds } = useWishlist()
  const { products } = useProducts()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [errors, setErrors] = useState({})

  const wishlistCount = products.filter((p) => productIds.includes(p.id)).length

  function handleSave(e) {
    e.preventDefault()
    const validationErrors = validateAuthForm({ ...form, password: 'placeholder123' })
    delete validationErrors.password
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    updateProfile(form)
    setEditing(false)
  }

  return (
    <div className="container-page py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">My Account</h1>
        <button onClick={logout} className="btn-ghost">Logout</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link to="/account/orders" className="border border-line p-5 hover:border-ink transition-colors">
          <p className="text-sm text-ink-soft">Orders</p>
          <p className="font-display text-2xl mt-1">View History</p>
        </Link>
        <div className="border border-line p-5">
          <p className="text-sm text-ink-soft">Wishlist</p>
          <p className="font-display text-2xl mt-1">{wishlistCount} items</p>
        </div>
        <div className="border border-line p-5">
          <p className="text-sm text-ink-soft">Member since</p>
          <p className="font-display text-2xl mt-1">This year</p>
        </div>
      </div>

      <div className="border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Profile</h2>
          {!editing && <button onClick={() => setEditing(true)} className="text-sm text-accent hover:underline">Edit</button>}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4 max-w-sm">
            <div>
              <label className="label-field">Full Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
              {errors.name && <p className="text-xs text-sale mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label-field">Email</label>
              <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" />
              {errors.email && <p className="text-xs text-sale mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        ) : (
          <dl className="grid sm:grid-cols-2 gap-4 text-sm max-w-sm">
            <div>
              <dt className="text-ink-soft mb-1">Full Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt className="text-ink-soft mb-1">Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  )
}
