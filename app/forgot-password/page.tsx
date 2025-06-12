'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import Link from 'next/link'


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the reset link.')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold text-center">Recover Password</h1>
      <form onSubmit={handleReset} className="space-y-4" aria-label="Recover form">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            className="w-full border p-2"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className={`w-full bg-black text-white p-2 ${loading ? 'animate-pulse' : ''}`} type="submit" disabled={loading}>
          Send Reset Link
        </button>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <Link href="/" className="text-sm text-blue-600 underline block text-center">Return home</Link>
    </div>
  )
}
