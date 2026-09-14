export default function StatCard({ label, value, icon: Icon, tone = 'default' }) {
  const toneClasses = tone === 'warning' ? 'text-amber-600' : tone === 'danger' ? 'text-sale' : 'text-accent'
  return (
    <div className="bg-white border border-line p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink-soft tracking-wide uppercase">{label}</span>
        {Icon && <Icon size={18} className={toneClasses} />}
      </div>
      <p className="text-2xl font-display">{value}</p>
    </div>
  )
}
