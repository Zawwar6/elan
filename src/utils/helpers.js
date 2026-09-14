import { SITE_CONFIG } from '../config/siteConfig'

/** Format a number as currency using the site's configured currency. */
export function formatCurrency(amount) {
  const value = Number.isFinite(amount) ? amount : 0
  return `${SITE_CONFIG.currencySymbol}${value.toFixed(2)}`
}

/** Simple, dependency-free unique ID generator (not cryptographically secure — fine for demo data). */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Human-friendly order ID, e.g. ELN-83920 */
export function generateOrderId() {
  const num = Math.floor(10000 + Math.random() * 89999)
  return `ELN-${num}`
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Merge class name strings, dropping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function calculateDiscountedPrice(price, discountPercent) {
  if (!discountPercent) return price
  return +(price - price * (discountPercent / 100)).toFixed(2)
}

export function getStockStatus(stock) {
  if (stock <= 0) return { label: 'Out of Stock', tone: 'out' }
  if (stock <= 5) return { label: 'Low Stock', tone: 'low' }
  return { label: 'In Stock', tone: 'in' }
}

export function truncate(str, length = 120) {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length).trim()}…`
}

export function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Debounce a function — used for search-as-you-type. */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function calculateCartTotals(cartItems, { shippingRate = SITE_CONFIG.flatShippingRate, freeShippingThreshold = SITE_CONFIG.freeShippingThreshold, couponDiscountPercent = 0 } = {}) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const couponDiscount = +(subtotal * (couponDiscountPercent / 100)).toFixed(2)
  const afterCoupon = subtotal - couponDiscount
  const shipping = cartItems.length === 0 || subtotal >= freeShippingThreshold ? 0 : shippingRate
  const total = +(afterCoupon + shipping).toFixed(2)
  return { subtotal: +subtotal.toFixed(2), couponDiscount, shipping, total }
}

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export const orderStatusTone = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Processing: 'bg-purple-100 text-purple-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}
