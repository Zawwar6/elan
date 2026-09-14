import { useMemo, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Rating from '../../components/common/Rating'
import { formatDate } from '../../utils/helpers'

export default function AdminReviews() {
  const { reviews, products, setReviewApproval, deleteReview } = useProducts()
  const toast = useToast()
  const [filter, setFilter] = useState('pending')
  const [pendingDelete, setPendingDelete] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'pending') return reviews.filter((r) => !r.approved)
    if (filter === 'approved') return reviews.filter((r) => r.approved)
    return reviews
  }, [reviews, filter])

  function productName(id) {
    return products.find((p) => p.id === id)?.name || 'Unknown product'
  }

  async function approve(id) {
    await setReviewApproval(id, true)
    toast.show('Review approved.', 'success')
  }

  async function confirmDelete() {
    await deleteReview(pendingDelete.id)
    toast.show('Review deleted.', 'success')
    setPendingDelete(null)
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm capitalize border ${filter === f ? 'border-ink bg-ink text-ivory' : 'border-line text-ink-soft'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-line p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink-soft mb-1.5">on {productName(r.productId)} · {formatDate(r.date)}</p>
                <Rating value={r.rating} size={13} />
                <p className="text-sm text-ink-soft mt-2">{r.comment}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!r.approved && (
                  <button onClick={() => approve(r.id)} aria-label="Approve review" className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200">
                    <Check size={15} />
                  </button>
                )}
                <button onClick={() => setPendingDelete(r)} aria-label="Delete review" className="w-8 h-8 flex items-center justify-center bg-red-50 text-sale hover:bg-red-100">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-ink-soft py-16">No reviews in this filter.</p>}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this review?"
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
