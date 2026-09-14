import { createContext, useContext, useEffect, useState } from 'react'
import { getAdminSession, setAdminSession, clearAdminSession } from '../utils/storage'
import { ADMIN_CONFIG, ADMIN_SESSION_DURATION } from '../config/adminConfig'
import { useToast } from './ToastContext'

/**
 * Admin authentication is checked against ADMIN_CONFIG (see
 * src/config/adminConfig.js) — a single, clearly-marked file —
 * rather than the customer users list. This keeps "who can shop"
 * and "who can manage the store" as two unrelated concerns.
 */
const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    getAdminSession().then((s) => {
      if (s && s.expiresAt > Date.now()) {
        setSession(s)
      } else if (s) {
        clearAdminSession()
      }
      setLoading(false)
    })
  }, [])

  async function login({ email, password }) {
    if (email.trim().toLowerCase() === ADMIN_CONFIG.email.toLowerCase() && password === ADMIN_CONFIG.password) {
      const newSession = { email, loggedInAt: Date.now(), expiresAt: Date.now() + ADMIN_SESSION_DURATION }
      await setAdminSession(newSession)
      setSession(newSession)
      toast.show('Welcome back, admin.', 'success')
      return { success: true }
    }
    return { success: false, message: 'Invalid admin credentials.' }
  }

  async function logout() {
    await clearAdminSession()
    setSession(null)
    toast.show('Signed out of admin.', 'info')
  }

  const isAdminAuthenticated = !!session && session.expiresAt > Date.now()

  return (
    <AdminAuthContext.Provider value={{ session, loading, isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  return ctx
}
