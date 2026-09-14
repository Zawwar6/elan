export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
}

export function isValidPhone(value) {
  return /^[+()\-\s\d]{7,20}$/.test(value || '')
}

export function isValidPostalCode(value) {
  return /^[A-Za-z0-9\-\s]{3,10}$/.test(value || '')
}

/** Returns an errors object; empty object means valid. */
export function validateCheckoutForm(form) {
  const errors = {}
  if (!form.fullName?.trim()) errors.fullName = 'Full name is required.'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'
  if (!isValidPhone(form.phone)) errors.phone = 'Enter a valid phone number.'
  if (!form.address?.trim()) errors.address = 'Address is required.'
  if (!form.city?.trim()) errors.city = 'City is required.'
  if (!form.state?.trim()) errors.state = 'Province/State is required.'
  if (!isValidPostalCode(form.postalCode)) errors.postalCode = 'Enter a valid postal code.'
  if (form.paymentMethod === 'card') {
    if (!/^\d{13,19}$/.test((form.cardNumber || '').replace(/\s/g, ''))) {
      errors.cardNumber = 'Enter a valid card number.'
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry || '')) {
      errors.cardExpiry = 'Use MM/YY format.'
    }
    if (!/^\d{3,4}$/.test(form.cardCvc || '')) {
      errors.cardCvc = 'Enter a valid CVC.'
    }
    if (!form.cardName?.trim()) errors.cardName = 'Name on card is required.'
  }
  return errors
}

export function validateProductForm(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Product name is required.'
  if (!form.sku?.trim()) errors.sku = 'SKU is required.'
  if (!form.category) errors.category = 'Category is required.'
  if (!form.price || Number(form.price) <= 0) errors.price = 'Enter a valid price.'
  if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Enter a valid stock quantity.'
  if (!form.sizes || form.sizes.length === 0) errors.sizes = 'Select at least one size.'
  if (!form.colors || form.colors.length === 0) errors.colors = 'Add at least one color.'
  if (!form.images || form.images.length === 0) errors.images = 'Add at least one image URL.'
  return errors
}

export function validateCouponForm(form) {
  const errors = {}
  if (!form.code?.trim()) errors.code = 'Coupon code is required.'
  if (!form.discountPercent || Number(form.discountPercent) <= 0 || Number(form.discountPercent) > 100) {
    errors.discountPercent = 'Enter a percentage between 1 and 100.'
  }
  if (!form.expiryDate) errors.expiryDate = 'Expiry date is required.'
  return errors
}

export function validateAuthForm(form, { isRegister = false } = {}) {
  const errors = {}
  if (isRegister && !form.name?.trim()) errors.name = 'Name is required.'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.password || form.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (isRegister && form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
  return errors
}
