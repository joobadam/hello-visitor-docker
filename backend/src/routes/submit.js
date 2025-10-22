const express = require('express')
const router = express.Router()
const validator = require('../utils/validator')
const db = require('../config/db')
const redisClient = require('../config/redis')
const { sendEmail } = require('../config/email')

router.post('/', async (req, res) => {
  const { name, email } = req.body
  const { valid, error } = validator.validateSubmit(name, email)
  if (!valid) return res.status(400).json({ success: false, error })

  let spamBlocked = false
  try {
    const key = `email:${email}`
    const exists = await redisClient.exists(key)
    if (exists) {
      spamBlocked = true
      return res.status(429).json({ success: false, error: 'Too many requests, wait 5 minutes' })
    }
  } catch {}

  try {
    await db.query('INSERT INTO visits(name, email) VALUES($1, $2)', [name, email])
  } catch (e) {
    return res.status(500).json({ success: false, error: 'Database error' })
  }

  try {
    await sendEmail(email, name)
  } catch {}

  try {
    const key = `email:${email}`
    await redisClient.set(key, '1', { EX: 300 })
  } catch {}

  res.json({ success: true, message: 'Email sent!' })
})

module.exports = router
