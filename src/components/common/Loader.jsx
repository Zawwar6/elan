export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-soft">
      <div className="w-6 h-6 border-2 border-line border-t-accent rounded-full animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
