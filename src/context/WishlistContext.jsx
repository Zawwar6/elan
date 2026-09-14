import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getWishlist, saveWishlist } from '../utils/storage'
import { useToast } from './ToastContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState([])
  const [loaded, setLoaded] = useState(false)
  const toast = useToast()

  useEffect(() => {
    getWishlist().then((list) => {
      setProductIds(list)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (loaded) saveWishlist(productIds)
  }, [productIds, loaded])

  function isWishlisted(productId) {
    return productIds.includes(productId)
  }

  function toggleWishlist(productId) {
    setProductIds((prev) => {
      if (prev.includes(productId)) {
        toast.show('Removed from wishlist.', 'info')
        return prev.filter((id) => id !== productId)
      }
      toast.show('Added to wishlist.', 'success')
      return [...prev, productId]
    })
  }

  function removeFromWishlist(productId) {
    setProductIds((prev) => prev.filter((id) => id !== productId))
  }

  const count = useMemo(() => productIds.length, [productIds])

  return (
    <WishlistContext.Provider value={{ productIds, isWishlisted, toggleWishlist, removeFromWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
