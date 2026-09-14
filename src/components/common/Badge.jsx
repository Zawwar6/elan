import { cn } from '../../utils/helpers'

const TONES = {
  new: 'bg-ink text-ivory',
  sale: 'bg-sale text-ivory',
  low: 'bg-amber-500 text-white',
  out: 'bg-ink-soft/60 text-white',
}

export default function Badge({ tone = 'new', children, className }) {
  return (
    <span className={cn('inline-block px-2 py-1 text-[11px] font-medium tracking-wide uppercase', TONES[tone], className)}>
      {children}
    </span>
  )
}
