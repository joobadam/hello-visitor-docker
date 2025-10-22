import React, { useState } from 'react'
import './VisitorForm.css'

export default function VisitorForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`Thanks ${name}! Check your email.`)
        setMessageType('success')
      } else {
        setMessage(data.error || 'Something went wrong')
        setMessageType('error')
      }
    } catch (e) {
      setMessage('Network error')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={onSubmit} className="form">
      <div className="field">
        <label className="label">Name</label>
        <input 
          className="input"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Your name"
          disabled={loading}
        />
      </div>
      <div className="field">
        <label className="label">Email</label>
        <input 
          className="input"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>
      <button 
        className="button"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Sending...' : 'Submit'}
      </button>
      {message && (
        <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
          <span>{messageType === 'success' ? '✓' : '✗'}</span>
          <span>{message}</span>
        </div>
      )}
    </form>
  )
}
