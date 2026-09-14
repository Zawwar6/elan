import { SITE_CONFIG } from '../../config/siteConfig'

export default function About() {
  return (
    <div>
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80"
          alt="Our studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
          <h1 className="font-display text-4xl sm:text-5xl text-ivory">Our Story</h1>
        </div>
      </div>
      <div className="container-page py-16 max-w-2xl mx-auto space-y-6 text-ink-soft leading-relaxed">
        <p>
          {SITE_CONFIG.brandName} started with a simple frustration: most clothing is designed to be replaced, not
          worn. We set out to build a wardrobe of pieces that hold up — physically and stylistically — season after
          season.
        </p>
        <p>
          Every piece is developed with a small group of mills and workshops we've worked with for years, chosen for
          craft rather than speed. We keep the collection tight on purpose: fewer, better things.
        </p>
        <p>
          We're still a small team, and we read every message that comes through our contact page. If something
          about your order or a product isn't right, tell us — we'll make it right.
        </p>
      </div>
    </div>
  )
}
