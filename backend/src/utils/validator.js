const validateSubmit = (name, email) => {
  const n = typeof name === 'string' ? name.trim() : ''
  const e = typeof email === 'string' ? email.trim() : ''
  if (!n) return { valid: false, error: 'Name required' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(e)) return { valid: false, error: 'Invalid email' }
  return { valid: true }
}

module.exports = { validateSubmit }
