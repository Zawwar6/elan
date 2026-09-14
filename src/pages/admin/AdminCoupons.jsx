import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { validateCouponForm } from '../../utils/validation'
import { formatDate } from '../../utils/helpers'

const EMPTY_FORM = { code: '', discountPercent: '', minOrder: '', expiryDate: '', usageLimit: '' }

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useProducts()
  const toast = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [pendingDelete, setPendingDelete] = useState(null)

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setErrors({})
    setFormOpen(true)
  }

  function openEdit(coupon) {
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      minOrder: coupon.minOrder,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
    })
    setEditingId(coupon.id)
    setErrors({})
    setFormOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateCouponForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      minOrder: Number(form.minOrder) || 0,
      expiryDate: form.expiryDate,
      usageLimit: Number(form.usageLimit) || 999999,
    }

    if (editingId) {
      await updateCoupon(editingId, payload)
      toast.show('Coupon updated.', 'success')
    } else {
      await addCoupon(payload)
      toast.show('Coupon created.', 'success')
    }
    setFormOpen(false)
  }

  async function confirmDelete() {
    await deleteCoupon(pendingDelete.id)
    toast.show('Coupon deleted.', 'success')
    setPendingDelete(null)
  }

  async function toggleActive(coupon) {
    await updateCoupon(coupon.id, { active: !coupon.active })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Coupons</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New Coupon</button>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft text-xs uppercase tracking-wide">
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                <td className="p-4 font-medium">{c.code}</td>
                <td className="p-4">{c.discountPercent}%</td>
                <td className="p-4 text-ink-soft">${c.minOrder}</td>
                <td className="p-4 text-ink-soft">{formatDate(c.expiryDate)}</td>
                <td className="p-4 text-ink-soft">{c.usedCount} / {c.usageLimit}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`text-xs px-2.5 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-stone text-ink-soft'}`}
                  >
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3 text-ink-soft">
                    <button onClick={() => openEdit(c)} aria-label="Edit coupon" className="hover:text-ink"><Pencil size={15} /></button>
                    <button onClick={() => setPendingDelete(c)} aria-label="Delete coupon" className="hover:text-sale"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-ink-soft">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFormOpen(false)} />
          <form onSubmit={handleSubmit} className="relative bg-white max-w-sm w-full p-6 space-y-4 animate-slideUp">
            <h3 className="font-display text-xl mb-1">{editingId ? 'Edit Coupon' : 'New Coupon'}</h3>
            <div>
              <label className="label-field">Code</label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="input-field" />
              {errors.code && <p className="text-xs text-sale mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="label-field">Discount Percentage</label>
              <input type="number" min="1" max="100" value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} className="input-field" />
              {errors.discountPercent && <p className="text-xs text-sale mt-1">{errors.discountPercent}</p>}
            </div>
            <div>
              <label className="label-field">Minimum Order ($)</label>
              <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-field">Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} className="input-field" />
              {errors.expiryDate && <p className="text-xs text-sale mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="label-field">Usage Limit</label>
              <input type="number" min="1" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className="input-field" placeholder="Leave blank for unlimited" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1">{editingId ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this coupon?"
        description={pendingDelete ? `"${pendingDelete.code}" will no longer be redeemable.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
