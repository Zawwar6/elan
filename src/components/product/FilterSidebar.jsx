import { X } from 'lucide-react'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const ALL_COLORS = ['Black', 'White', 'Olive', 'Camel', 'Navy', 'Stone', 'Indigo']

function Section({ title, children }) {
  return (
    <div className="py-5 border-b border-line">
      <h4 className="text-sm font-medium text-ink mb-3">{title}</h4>
      {children}
    </div>
  )
}

export default function FilterSidebar({ filters, setFilters, categories, mobileOpen, onCloseMobile }) {
  function toggleArrayValue(key, value) {
    setFilters((prev) => {
      const current = prev[key]
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  function clearAll() {
    setFilters({
      category: '',
      subcategory: '',
      sizes: [],
      colors: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      inStockOnly: false,
    })
  }

  const activeCategory = categories.find((c) => c.slug === filters.category)

  const body = (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg">Filters</h3>
        <button onClick={clearAll} className="text-xs text-accent hover:underline">
          Clear all
        </button>
      </div>

      <Section title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => setFilters((prev) => ({ ...prev, category: cat.slug, subcategory: '' }))}
                className="accent-accent"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </Section>

      {activeCategory && (
        <Section title="Subcategory">
          <div className="space-y-2">
            {activeCategory.subcategories.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                <input
                  type="radio"
                  name="subcategory"
                  checked={filters.subcategory === sub.slug}
                  onChange={() => setFilters((prev) => ({ ...prev, subcategory: sub.slug }))}
                  className="accent-accent"
                />
                {sub.name}
              </label>
            ))}
          </div>
        </Section>
      )}

      <Section title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
            className="input-field !py-2 !px-3 text-xs"
          />
          <span className="text-ink-soft">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            className="input-field !py-2 !px-3 text-xs"
          />
        </div>
      </Section>

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayValue('sizes', size)}
              className={`w-9 h-9 text-xs border transition-colors ${
                filters.sizes.includes(size) ? 'border-ink bg-ink text-ivory' : 'border-line text-ink hover:border-ink'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => toggleArrayValue('colors', color)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                filters.colors.includes(color) ? 'border-ink bg-ink text-ivory' : 'border-line text-ink hover:border-ink'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Rating">
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => setFilters((prev) => ({ ...prev, minRating: r }))}
                className="accent-accent"
              />
              {r}★ & up
            </label>
          ))}
        </div>
      </Section>

      <div className="pt-5">
        <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="accent-accent"
          />
          In stock only
        </label>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 pr-6">{body}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onCloseMobile} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-ivory p-6 overflow-y-auto animate-slideInRight">
            <button onClick={onCloseMobile} aria-label="Close filters" className="absolute top-5 right-5 text-ink-soft">
              <X size={20} />
            </button>
            {body}
            <button onClick={onCloseMobile} className="btn-primary w-full mt-6">
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  )
}
