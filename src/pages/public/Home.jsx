import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import ProductGrid from '../../components/product/ProductGrid'
import QuickView from '../../components/product/QuickView'
import Rating from '../../components/common/Rating'
import Loader from '../../components/common/Loader'
import { SITE_CONFIG } from '../../config/siteConfig'

const CATEGORY_TILES = [
  { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1487222476894-8944d305c8cd?auto=format&fit=crop&w=900&q=80', span: 'lg:col-span-2 lg:row-span-2' },
  { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=700&q=80', span: '' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=700&q=80', span: '' },
  { name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80', span: '' },
]

const REVIEWS = [
  { name: 'Hannah W.', quote: 'The field jacket has replaced three other coats in my closet. It just works.', rating: 5 },
  { name: 'Daniel P.', quote: 'First online order where the sizing chart was actually accurate.', rating: 5 },
  { name: 'Naomi C.', quote: 'Slow fashion done right — you can feel the difference in the fabric.', rating: 4 },
]

const GALLERY = [
  'photo-1521572163474-6864f9cf17ab',
  'photo-1490481651871-ab68de25d43d',
  'photo-1515372039744-b8f02a3ae446',
  'photo-1594938298603-c8148c4dae35',
  'photo-1551028719-00167b16eac5',
  'photo-1566174053879-31528523f8ae',
]

export default function Home() {
  const { products, loading } = useProducts()
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  if (loading) return <Loader label="Loading the collection…" />

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4)
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4)
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="Model wearing the new season collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="relative h-full container-page flex flex-col justify-end pb-20 text-ivory">
          <p className="text-sm tracking-[0.2em] uppercase mb-4 animate-fadeIn">Autumn Collection</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl max-w-xl leading-[1.05] animate-slideUp">
            Clothes built to be worn, not replaced.
          </h1>
          <p className="mt-5 max-w-md text-ivory/85 animate-slideUp">{SITE_CONFIG.tagline}</p>
          <div className="flex flex-wrap gap-4 mt-8 animate-slideUp">
            <Link to="/category/women" className="bg-ivory text-ink px-7 py-3.5 text-sm tracking-wide hover:bg-ivory/90 transition-colors">
              Shop Women
            </Link>
            <Link to="/category/men" className="border border-ivory text-ivory px-7 py-3.5 text-sm tracking-wide hover:bg-ivory hover:text-ink transition-colors">
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 h-auto lg:h-[560px]">
          {CATEGORY_TILES.map((tile) => (
            <Link key={tile.slug} to={`/category/${tile.slug}`} className={`group relative overflow-hidden ${tile.span} h-56 lg:h-auto`}>
              <img src={tile.image} alt={tile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/35 transition-colors" />
              <span className="absolute bottom-5 left-5 text-ivory font-display text-2xl">{tile.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl">Featured</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm text-accent hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={featured} onQuickView={setQuickViewProduct} />
      </section>

      {/* Promo banner */}
      <section className="relative h-72 my-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=80"
          alt="Outerwear edit"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/40 flex items-center">
          <div className="container-page text-ivory">
            <p className="text-xs tracking-[0.2em] uppercase mb-2">Limited Run</p>
            <h3 className="font-display text-3xl sm:text-4xl mb-4 max-w-md">The Outerwear Edit — up to 20% off</h3>
            <Link to="/shop?filter=sale" className="inline-block bg-ivory text-ink px-6 py-3 text-sm hover:bg-ivory/90">
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl">New Arrivals</h2>
          <Link to="/shop?filter=new" className="flex items-center gap-1 text-sm text-accent hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} onQuickView={setQuickViewProduct} />
      </section>

      {/* Trending */}
      <section className="bg-stone py-14">
        <div className="container-page">
          <h2 className="font-display text-3xl mb-8">Trending Now</h2>
          <ProductGrid products={trending} onQuickView={setQuickViewProduct} />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl">Best Sellers</h2>
          <Link to="/shop?filter=bestseller" className="flex items-center gap-1 text-sm text-accent hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={bestSellers} onQuickView={setQuickViewProduct} />
      </section>

      {/* Reviews */}
      <section className="container-page py-16 border-t border-line">
        <h2 className="font-display text-3xl mb-10 text-center">What people are saying</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {REVIEWS.map((r) => (
            <div key={r.name} className="text-center px-4">
              <div className="flex justify-center mb-3"><Rating value={r.rating} /></div>
              <p className="text-ink-soft italic">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-sm text-ink mt-3">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-accent text-ivory py-16">
        <div className="container-page max-w-xl text-center">
          <h2 className="font-display text-3xl mb-3">Stay in the loop</h2>
          <p className="text-ivory/80 mb-6">New arrivals, early access to sales, and the occasional good story. No spam.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm text-ink bg-ivory focus:outline-none"
            />
            <button type="submit" className="bg-ink text-ivory px-6 py-3 text-sm hover:bg-ink/90 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <h2 className="font-display text-3xl text-center mb-8">@{SITE_CONFIG.brandName.toLowerCase()} on Instagram</h2>
        <div className="grid grid-cols-3 md:grid-cols-6">
          {GALLERY.map((id) => (
            <a key={id} href={SITE_CONFIG.socials.instagram} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden group">
              <img
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80`}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </section>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
