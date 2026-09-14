const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'bestselling', label: 'Best Selling' },
]

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort products"
      className="border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-accent"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort: {opt.label}
        </option>
      ))}
    </select>
  )
}

export function sortProducts(products, sortBy) {
  const list = [...products]
  switch (sortBy) {
    case 'newest':
      return list.sort((a, b) => (b.newArrival === a.newArrival ? 0 : b.newArrival ? 1 : -1))
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    case 'bestselling':
      return list.sort((a, b) => (b.bestSeller === a.bestSeller ? 0 : b.bestSeller ? 1 : -1))
    default:
      return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1))
  }
}
