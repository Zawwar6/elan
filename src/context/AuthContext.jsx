import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, setCurrentUser, clearCurrentUser, getUsers, saveUsers } from '../utils/storage'
import { generateId } from '../utils/helpers'
import { useToast } from './ToastContext'

/**
 * Customer authentication — intentionally separate from admin
 * authentication (see AdminAuthContext). A customer session and
 * an admin session are different localStorage keys, different
 * contexts, and different protected-route guards, so there is no
 * path by which logging in as one grants the other.
 *
 * Demo-only: passwords are stored in plain text in localStorage,
 * which is fine for a prototype but must not be treated as real
 * authentication. See README > Security Limitations.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  async function register({ name, email, password }) {
    const users = await getUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' }
    }
    const newUser = { id: generateId('user'), name, email, password, createdAt: new Date().toISOString() }
    await saveUsers([...users, newUser])
    const publicUser = { id: newUser.id, name: newUser.name, email: newUser.email }
    await setCurrentUser(publicUser)
    setUser(publicUser)
    toast.show(`Welcome, ${name.split(' ')[0]}.`, 'success')
    return { success: true }
  }

  async function login({ email, password }) {
    const users = await getUsers()
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) {
      return { success: false, message: 'Invalid email or password.' }
    }
    const publicUser = { id: found.id, name: found.name, email: found.email }
    await setCurrentUser(publicUser)
    setUser(publicUser)
    toast.show(`Welcome back, ${found.name.split(' ')[0]}.`, 'success')
    return { success: true }
  }

  async function logout() {
    await clearCurrentUser()
    setUser(null)
    toast.show('Signed out.', 'info')
  }

  async function updateProfile(updates) {
    const users = await getUsers()
    const nextUsers = users.map((u) => (u.id === user.id ? { ...u, ...updates } : u))
    await saveUsers(nextUsers)
    const publicUser = { id: user.id, name: updates.name ?? user.name, email: updates.email ?? user.email }
    await setCurrentUser(publicUser)
    setUser(publicUser)
    toast.show('Profile updated.', 'success')
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
