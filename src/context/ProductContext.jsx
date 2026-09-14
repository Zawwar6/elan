import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  initializeStorage,
  getProducts,
  saveProducts,
  getCategories,
  saveCategories,
  getCoupons,
  saveCoupons,
  getReviews,
  saveReviews,
  subscribeToKey,
  STORAGE_KEYS,
} from '../utils/storage'
import { generateId } from '../utils/helpers'

/**
 * Owns products, categories, coupons and reviews for the whole app.
 * Both the storefront and the admin panel read from this single
 * context, so an admin edit re-renders the storefront instantly —
 * there is no separate "admin data" vs "customer data".
 */
const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [coupons, setCoupons] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      await initializeStorage()
      const [p, c, cp, r] = await Promise.all([getProducts(), getCategories(), getCoupons(), getReviews()])
      if (!mounted) return
      setProducts(p)
      setCategories(c)
      setCoupons(cp)
      setReviews(r)
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Stay in sync if another part of the app (or another tab) writes directly.
  useEffect(() => {
    const unsubs = [
      subscribeToKey(STORAGE_KEYS.PRODUCTS, (val) => val && setProducts(val)),
      subscribeToKey(STORAGE_KEYS.CATEGORIES, (val) => val && setCategories(val)),
      subscribeToKey(STORAGE_KEYS.COUPONS, (val) => val && setCoupons(val)),
      subscribeToKey(STORAGE_KEYS.REVIEWS, (val) => val && setReviews(val)),
    ]
    return () => unsubs.forEach((unsub) => unsub())
  }, [])

  // ---------------- Products ----------------
  const addProduct = useCallback(async (productData) => {
    const newProduct = { id: generateId('prod'), rating: 0, reviewCount: 0, ...productData }
    const next = [newProduct, ...products]
    setProducts(next)
    await saveProducts(next)
    return newProduct
  }, [products])

  const updateProduct = useCallback(async (id, updates) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    setProducts(next)
    await saveProducts(next)
  }, [products])

  const deleteProduct = useCallback(async (id) => {
    const next = products.filter((p) => p.id !== id)
    setProducts(next)
    await saveProducts(next)
  }, [products])

  const adjustStock = useCallback(async (id, delta) => {
    const next = products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    setProducts(next)
    await saveProducts(next)
  }, [products])

  const decrementStockForOrder = useCallback(async (items) => {
    const next = products.map((p) => {
      const line = items.find((i) => i.productId === p.id)
      if (!line) return p
      return { ...p, stock: Math.max(0, p.stock - line.quantity) }
    })
    setProducts(next)
    await saveProducts(next)
  }, [products])

  // ---------------- Categories ----------------
  const addCategory = useCallback(async (categoryData) => {
    const newCategory = { id: generateId('cat'), subcategories: [], ...categoryData }
    const next = [...categories, newCategory]
    setCategories(next)
    await saveCategories(next)
  }, [categories])

  const updateCategory = useCallback(async (id, updates) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    setCategories(next)
    await saveCategories(next)
  }, [categories])

  const deleteCategory = useCallback(async (id) => {
    const next = categories.filter((c) => c.id !== id)
    setCategories(next)
    await saveCategories(next)
  }, [categories])

  // ---------------- Coupons ----------------
  const addCoupon = useCallback(async (couponData) => {
    const newCoupon = { id: generateId('cpn'), usedCount: 0, active: true, ...couponData }
    const next = [...coupons, newCoupon]
    setCoupons(next)
    await saveCoupons(next)
  }, [coupons])

  const updateCoupon = useCallback(async (id, updates) => {
    const next = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c))
    setCoupons(next)
    await saveCoupons(next)
  }, [coupons])

  const deleteCoupon = useCallback(async (id) => {
    const next = coupons.filter((c) => c.id !== id)
    setCoupons(next)
    await saveCoupons(next)
  }, [coupons])

  const validateCoupon = useCallback((code, subtotal) => {
    const coupon = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase())
    if (!coupon) return { valid: false, message: 'Coupon code not found.' }
    if (!coupon.active) return { valid: false, message: 'This coupon is no longer active.' }
    if (new Date(coupon.expiryDate) < new Date()) return { valid: false, message: 'This coupon has expired.' }
    if (coupon.usedCount >= coupon.usageLimit) return { valid: false, message: 'This coupon has reached its usage limit.' }
    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order of $${coupon.minOrder} required for this coupon.` }
    }
    return { valid: true, coupon }
  }, [coupons])

  const redeemCoupon = useCallback(async (id) => {
    const next = coupons.map((c) => (c.id === id ? { ...c, usedCount: c.usedCount + 1 } : c))
    setCoupons(next)
    await saveCoupons(next)
  }, [coupons])

  // ---------------- Reviews ----------------
  const addReview = useCallback(async (reviewData) => {
    const newReview = {
      id: generateId('rev'),
      date: new Date().toISOString(),
      approved: false,
      ...reviewData,
    }
    const next = [newReview, ...reviews]
    setReviews(next)
    await saveReviews(next)
    return newReview
  }, [reviews])

  const setReviewApproval = useCallback(async (id, approved) => {
    const next = reviews.map((r) => (r.id === id ? { ...r, approved } : r))
    setReviews(next)
    await saveReviews(next)
  }, [reviews])

  const deleteReview = useCallback(async (id) => {
    const next = reviews.filter((r) => r.id !== id)
    setReviews(next)
    await saveReviews(next)
  }, [reviews])

  const value = useMemo(() => ({
    products,
    categories,
    coupons,
    reviews,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    decrementStockForOrder,
    addCategory,
    updateCategory,
    deleteCategory,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    redeemCoupon,
    addReview,
    setReviewApproval,
    deleteReview,
  }), [products, categories, coupons, reviews, loading, addProduct, updateProduct, deleteProduct, adjustStock, decrementStockForOrder, addCategory, updateCategory, deleteCategory, addCoupon, updateCoupon, deleteCoupon, validateCoupon, redeemCoupon, addReview, setReviewApproval, deleteReview])

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider')
  return ctx
}
