import { Star } from 'lucide-react'

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(value) ? 'fill-accent text-accent' : 'fill-line text-line'}
          />
        ))}
      </div>
      {typeof count === 'number' && <span className="text-xs text-ink-soft">({count})</span>}
    </div>
  )
}
