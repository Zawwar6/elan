import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCart, saveCart } from '../utils/storage'
import { useToast } from './ToastContext'

const CartContext = createContext(null)

/**
 * Cart line shape: { productId, name, image, price, size, color, quantity, stock, sku }
 * We snapshot price/name/image at add-time so the cart still renders
 * correctly even if a product is later edited or removed by admin —
 * but quantity is always re-clamped against *current* stock.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const toast = useToast()

  useEffect(() => {
    getCart().then((cart) => {
      setItems(cart)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) saveCart(items)
  }, [items, loaded])

  function lineKey(productId, size, color) {
    return `${productId}__${size}__${color}`
  }

  function addItem(product, { size, color, quantity = 1 }) {
    setItems((prev) => {
      const key = lineKey(product.id, size, color)
      const existing = prev.find((i) => lineKey(i.productId, i.size, i.color) === key)
      const maxAllowed = product.stock

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxAllowed)
        if (nextQty === existing.quantity) {
          toast.show('Only that many are in stock.', 'error')
          return prev
        }
        toast.show('Cart updated.', 'success')
        return prev.map((i) => (lineKey(i.productId, i.size, i.color) === key ? { ...i, quantity: nextQty } : i))
      }

      const qty = Math.min(quantity, maxAllowed)
      if (qty <= 0) {
        toast.show('This item is out of stock.', 'error')
        return prev
      }
      toast.show('Added to cart.', 'success')
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          image: product.images?.[0],
          price: product.discount ? +(product.price - (product.price * product.discount) / 100).toFixed(2) : product.price,
          size,
          color,
          quantity: qty,
          stock: maxAllowed,
          sku: product.sku,
        },
      ]
    })
  }

  function updateQuantity(productId, size, color, quantity) {
    setItems((prev) =>
      prev.map((i) => {
        if (lineKey(i.productId, i.size, i.color) !== lineKey(productId, size, color)) return i
        const clamped = Math.max(1, Math.min(quantity, i.stock))
        return { ...i, quantity: clamped }
      })
    )
  }

  function removeItem(productId, size, color) {
    setItems((prev) => prev.filter((i) => lineKey(i.productId, i.size, i.color) !== lineKey(productId, size, color)))
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = { items, addItem, updateQuantity, removeItem, clearCart, itemCount, loaded }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
