import { useParams } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import ProductListing from './ProductListing'
import Loader from '../../components/common/Loader'

export default function Category() {
  const { slug } = useParams()
  const { categories, loading } = useProducts()
  if (loading) return <Loader />
  const category = categories.find((c) => c.slug === slug)
  return <ProductListing title={category?.name || 'Category'} forcedCategorySlug={slug} />
}
