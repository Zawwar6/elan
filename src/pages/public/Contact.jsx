import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig'
import { useToast } from '../../context/ToastContext'
import { isValidEmail } from '../../utils/validation'

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.message.trim()) nextErrors.message = 'Please enter a message.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    toast.show("Message sent — we'll get back to you shortly.", 'success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl mb-10 text-center">Contact Us</h1>
      <div className="grid lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
        <div className="space-y-6 text-sm">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.supportEmail}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.supportPhone}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{SITE_CONFIG.address}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
            {errors.name && <p className="text-xs text-sale mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label-field">Email</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" />
            {errors.email && <p className="text-xs text-sale mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="input-field" />
            {errors.message && <p className="text-xs text-sale mt-1">{errors.message}</p>}
          </div>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  )
}
