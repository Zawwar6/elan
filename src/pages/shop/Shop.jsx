import { useSearchParams } from 'react-router-dom'
import ProductListing from './ProductListing'

export default function Shop() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')
  const titles = { new: 'New Arrivals', sale: 'Sale', bestseller: 'Best Sellers' }
  return <ProductListing title={titles[filter] || 'Shop All'} quickFilter={filter} />
}
