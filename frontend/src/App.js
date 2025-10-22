import React from 'react'
import VisitorForm from './components/VisitorForm'
import './App.css'

export default function App() {
  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Welcome! 👋</h1>
        <VisitorForm />
      </div>
    </div>
  )
}
