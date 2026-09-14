import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validateAuthForm } from '../../utils/validation'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const validationErrors = validateAuthForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const result = await login(form)
    setSubmitting(false)
    if (!result.success) {
      setServerError(result.message)
      return
    }
    navigate(location.state?.from?.pathname || '/account')
  }

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display text-3xl mb-2">Sign In</h1>
      <p className="text-ink-soft mb-8">Welcome back. Enter your details to continue.</p>

      {serverError && <p className="text-sm text-sale mb-4">{serverError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" />
          {errors.email && <p className="text-xs text-sale mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="label-field">Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input-field" />
          {errors.password && <p className="text-xs text-sale mt-1">{errors.password}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Don't have an account? <Link to="/register" className="text-accent hover:underline">Create one</Link>
      </p>
    </div>
  )
}
