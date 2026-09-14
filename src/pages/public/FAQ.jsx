import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery, provided items are unworn and in original condition with tags attached.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–6 business days. Orders over the free shipping threshold ship at no cost.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within the country listed at checkout. International shipping is on our roadmap.' },
  { q: 'How do I know what size to order?', a: 'Each product page lists true-to-size guidance in the description. When in doubt, size up for a relaxed fit.' },
  { q: 'Can I change or cancel my order?', a: 'Contact us as soon as possible after placing your order — we can usually accommodate changes before it ships.' },
  { q: 'How do I use a coupon code?', a: 'Enter your code in the cart or at checkout and it will be applied automatically if valid.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-10 text-center">Frequently Asked Questions</h1>
      <div className="divide-y divide-line border-t border-b border-line">
        {FAQS.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm sm:text-base text-ink">{item.q}</span>
              <ChevronDown size={18} className={`text-ink-soft transition-transform shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && <p className="text-sm text-ink-soft pb-5 pr-8">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
