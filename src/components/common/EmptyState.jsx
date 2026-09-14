import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && <Icon size={40} strokeWidth={1.2} className="text-ink-soft/50 mb-4" />}
      <h3 className="text-xl font-display mb-2">{title}</h3>
      {description && <p className="text-ink-soft max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
