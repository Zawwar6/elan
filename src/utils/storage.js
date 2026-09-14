/**
 * ============================================================
 *  STORAGE LAYER
 * ============================================================
 * This file is the ONLY place in the app that touches
 * localStorage directly. Every other file (contexts, pages,
 * admin screens) calls the functions exported here instead.
 *
 * Why it's shaped this way:
 * Every function below returns a Promise and resolves/rejects
 * the way a `fetch` call to a real API would — even though the
 * underlying read/write is synchronous today. That means when
 * this project eventually gets a real backend, only this file
 * needs to change (swap the body of each function for a `fetch`
 * call); every component and context that calls
 * `await getProducts()` keeps working exactly as it does now.
 *
 * It also centralizes the two things that are easy to get wrong
 * with localStorage-as-a-database:
 *   1. JSON parse/stringify errors (corrupted or missing data)
 *   2. Same-tab reactivity — writing to localStorage does NOT
 *      re-render anything on its own, and the native `storage`
 *      event only fires in *other* tabs. We dispatch a matching
 *      custom event after every write so contexts in the same
 *      tab (e.g. admin editing a product while the storefront
 *      context is mounted) can stay in sync too.
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'elan_products',
  CATEGORIES: 'elan_categories',
  COUPONS: 'elan_coupons',
  REVIEWS: 'elan_reviews',
  CART: 'elan_cart',
  WISHLIST: 'elan_wishlist',
  ORDERS: 'elan_orders',
  USERS: 'elan_users',
  CURRENT_USER: 'elan_current_user',
  ADMIN_SESSION: 'elan_admin_session',
  SEEDED: 'elan_seeded_v1',
}

const EVENT_NAME = 'elan:storage-update'

/** Low-level: safe JSON read with a fallback value on any failure. */
function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`[storage] Failed to read "${key}", using fallback.`, err)
    return fallback
  }
}

/** Low-level: safe JSON write. Returns true/false instead of throwing. */
function writeKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, value } }))
    return true
  } catch (err) {
    // Most common cause: storage quota exceeded (e.g. huge base64 images).
    console.error(`[storage] Failed to write "${key}".`, err)
    return false
  }
}

/**
 * Subscribe to changes for a given key, in this tab or another.
 * Returns an unsubscribe function. Used by contexts to react to
 * writes made elsewhere in the app (e.g. admin panel) without prop drilling.
 */
export function subscribeToKey(key, callback) {
  const handleCustomEvent = (e) => {
    if (e.detail?.key === key) callback(e.detail.value)
  }
  const handleStorageEvent = (e) => {
    if (e.key === key) callback(readKey(key, null))
  }
  window.addEventListener(EVENT_NAME, handleCustomEvent)
  window.addEventListener('storage', handleStorageEvent)
  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
}

// ---------------------------------------------------------------
// Seeding — runs once, on first load, to populate demo data.
// ---------------------------------------------------------------
export async function initializeStorage() {
  const alreadySeeded = readKey(STORAGE_KEYS.SEEDED, false)
  if (alreadySeeded) return

  const { DEFAULT_PRODUCTS } = await import('../data/products.js')
  const { DEFAULT_CATEGORIES } = await import('../data/categories.js')
  const { DEFAULT_COUPONS } = await import('../data/coupons.js')

  writeKey(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS)
  writeKey(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
  writeKey(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS)
  writeKey(STORAGE_KEYS.REVIEWS, seedReviews(DEFAULT_PRODUCTS))
  writeKey(STORAGE_KEYS.ORDERS, [])
  writeKey(STORAGE_KEYS.USERS, [])
  writeKey(STORAGE_KEYS.SEEDED, true)
}

function seedReviews(products) {
  const names = ['Jordan M.', 'Priya K.', 'Sam T.', 'Alex R.', 'Morgan L.']
  const comments = [
    'Fits exactly as described and the fabric feels genuinely premium.',
    'Ordered a size up based on other reviews — glad I did.',
    'Took a star off only because shipping was slower than expected.',
    'This has become an everyday piece for me already.',
    'Better in person than in the photos, which is rare.',
  ]
  const reviews = []
  products.slice(0, 10).forEach((p, i) => {
    reviews.push({
      id: `rev-${p.id}-1`,
      productId: p.id,
      name: names[i % names.length],
      rating: 4 + (i % 2),
      comment: comments[i % comments.length],
      date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      approved: true,
    })
  })
  return reviews
}

// ---------------------------------------------------------------
// Products
// ---------------------------------------------------------------
export async function getProducts() {
  return readKey(STORAGE_KEYS.PRODUCTS, [])
}
export async function saveProducts(products) {
  return writeKey(STORAGE_KEYS.PRODUCTS, products)
}

// ---------------------------------------------------------------
// Categories
// ---------------------------------------------------------------
export async function getCategories() {
  return readKey(STORAGE_KEYS.CATEGORIES, [])
}
export async function saveCategories(categories) {
  return writeKey(STORAGE_KEYS.CATEGORIES, categories)
}

// ---------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------
export async function getCoupons() {
  return readKey(STORAGE_KEYS.COUPONS, [])
}
export async function saveCoupons(coupons) {
  return writeKey(STORAGE_KEYS.COUPONS, coupons)
}

// ---------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------
export async function getReviews() {
  return readKey(STORAGE_KEYS.REVIEWS, [])
}
export async function saveReviews(reviews) {
  return writeKey(STORAGE_KEYS.REVIEWS, reviews)
}

// ---------------------------------------------------------------
// Cart (guest-friendly: not tied to a logged-in user)
// ---------------------------------------------------------------
export async function getCart() {
  return readKey(STORAGE_KEYS.CART, [])
}
export async function saveCart(cart) {
  return writeKey(STORAGE_KEYS.CART, cart)
}

// ---------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------
export async function getWishlist() {
  return readKey(STORAGE_KEYS.WISHLIST, [])
}
export async function saveWishlist(wishlist) {
  return writeKey(STORAGE_KEYS.WISHLIST, wishlist)
}

// ---------------------------------------------------------------
// Orders
// ---------------------------------------------------------------
export async function getOrders() {
  return readKey(STORAGE_KEYS.ORDERS, [])
}
export async function saveOrders(orders) {
  return writeKey(STORAGE_KEYS.ORDERS, orders)
}

// ---------------------------------------------------------------
// Users (customer accounts) — demo-only password handling.
// Passwords are NOT hashed here; see README security limitations.
// ---------------------------------------------------------------
export async function getUsers() {
  return readKey(STORAGE_KEYS.USERS, [])
}
export async function saveUsers(users) {
  return writeKey(STORAGE_KEYS.USERS, users)
}
export async function getCurrentUser() {
  return readKey(STORAGE_KEYS.CURRENT_USER, null)
}
export async function setCurrentUser(user) {
  return writeKey(STORAGE_KEYS.CURRENT_USER, user)
}
export async function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: STORAGE_KEYS.CURRENT_USER, value: null } }))
  return true
}

// ---------------------------------------------------------------
// Admin session — deliberately separate from customer auth.
// ---------------------------------------------------------------
export async function getAdminSession() {
  return readKey(STORAGE_KEYS.ADMIN_SESSION, null)
}
export async function setAdminSession(session) {
  return writeKey(STORAGE_KEYS.ADMIN_SESSION, session)
}
export async function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: STORAGE_KEYS.ADMIN_SESSION, value: null } }))
  return true
}
