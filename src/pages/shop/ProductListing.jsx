import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import ProductGrid from '../../components/product/ProductGrid'
import FilterSidebar from '../../components/product/FilterSidebar'
import SortDropdown, { sortProducts } from '../../components/product/SortDropdown'
import QuickView from '../../components/product/QuickView'
import Loader from '../../components/common/Loader'

const DEFAULT_FILTERS = {
  category: '',
  subcategory: '',
  sizes: [],
  colors: [],
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  inStockOnly: false,
}

export default function ProductListing({ title, forcedCategorySlug, quickFilter, searchQuery }) {
  const { products, categories, loading } = useProducts()
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, category: forcedCategorySlug || '' })
  const [sortBy, setSortBy] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: forcedCategorySlug || '' }))
  }, [forcedCategorySlug])

  const filtered = useMemo(() => {
    let list = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (quickFilter === 'new') list = list.filter((p) => p.newArrival)
    if (quickFilter === 'sale') list = list.filter((p) => p.discount > 0)
    if (quickFilter === 'bestseller') list = list.filter((p) => p.bestSeller)

    if (filters.category) {
      const cat = categories.find((c) => c.slug === filters.category)
      if (cat) list = list.filter((p) => p.category === cat.name)
    }
    if (filters.subcategory) {
      const cat = categories.find((c) => c.slug === filters.category)
      const sub = cat?.subcategories.find((s) => s.slug === filters.subcategory)
      if (sub) list = list.filter((p) => p.subcategory === sub.name)
    }
    if (filters.sizes.length > 0) list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)))
    if (filters.colors.length > 0) list = list.filter((p) => p.colors.some((c) => filters.colors.includes(c)))
    if (filters.minPrice) list = list.filter((p) => p.price >= Number(filters.minPrice))
    if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice))
    if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating)
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0)

    return sortProducts(list, sortBy)
  }, [products, categories, filters, sortBy, quickFilter, searchQuery])

  if (loading) return <Loader />

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="text-sm text-ink-soft mt-1">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-line px-3 py-2 text-sm"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="flex">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />
        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} onQuickView={setQuickViewProduct} />
        </div>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
