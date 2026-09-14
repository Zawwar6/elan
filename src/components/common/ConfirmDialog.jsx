import { X } from 'lucide-react'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-ink/40 animate-fadeIn" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-sm p-6 shadow-xl animate-slideUp">
        <button onClick={onCancel} aria-label="Close" className="absolute top-4 right-4 text-ink-soft hover:text-ink">
          <X size={18} />
        </button>
        <h3 id="confirm-title" className="font-display text-lg mb-2 pr-6">{title}</h3>
        {description && <p className="text-sm text-ink-soft mb-6">{description}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button
            onClick={onConfirm}
            className={danger ? 'inline-flex items-center justify-center gap-2 bg-sale text-ivory px-6 py-3 text-sm tracking-wide hover:bg-sale/90' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
