import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { SITE_CONFIG } from '../../config/siteConfig'

export default function AdminLogin() {
  const { login, isAdminAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAdminAuthenticated) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await login(form)
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="bg-ivory w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Lock size={20} className="text-accent" />
          </div>
          <h1 className="font-display text-2xl tracking-widest">{SITE_CONFIG.brandName}</h1>
          <p className="text-xs text-ink-soft uppercase tracking-wide mt-1">Admin Panel</p>
        </div>

        {error && <p className="text-sm text-sale mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input-field"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="input-field"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-[11px] text-ink-soft mt-6 text-center">
          Credentials are configured in <code className="bg-stone px-1">src/config/adminConfig.js</code>
        </p>
      </div>
    </div>
  )
}
