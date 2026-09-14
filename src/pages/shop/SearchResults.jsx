import { useSearchParams } from 'react-router-dom'
import ProductListing from './ProductListing'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  return <ProductListing title={q ? `Results for "${q}"` : 'Search'} searchQuery={q} />
}
