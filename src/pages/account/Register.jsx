import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validateAuthForm } from '../../utils/validation'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const validationErrors = validateAuthForm(form, { isRegister: true })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const result = await register(form)
    setSubmitting(false)
    if (!result.success) {
      setServerError(result.message)
      return
    }
    navigate('/account')
  }

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display text-3xl mb-2">Create Account</h1>
      <p className="text-ink-soft mb-8">Join to check out faster and track your orders.</p>

      {serverError && <p className="text-sm text-sale mb-4">{serverError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Full Name</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
          {errors.name && <p className="text-xs text-sale mt-1">{errors.name}</p>}
        </div>
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
        <div>
          <label className="label-field">Confirm Password</label>
          <input type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="input-field" />
          {errors.confirmPassword && <p className="text-xs text-sale mt-1">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
