/**
 * ============================================================
 *  ADMIN CREDENTIALS — CHANGE THESE BEFORE DEPLOYING
 * ============================================================
 * This is the ONLY place admin credentials live in the project.
 * There is intentionally no backend, so these are checked
 * entirely in the browser. See README.md, section "Security
 * Limitations" for why this is not suitable for a system that
 * holds real customer/payment data.
 */
export const ADMIN_CONFIG = {
  email: 'admin@elan-store.example',
  password: 'ChangeThisPassword123!',
}

// How long an admin session stays valid without re-login (ms).
export const ADMIN_SESSION_DURATION = 1000 * 60 * 60 * 8 // 8 hours
