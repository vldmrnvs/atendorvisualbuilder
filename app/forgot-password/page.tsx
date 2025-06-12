'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'

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
    <form onSubmit={handleReset} className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="w-full bg-black text-white p-2" type="submit">
        {loading ? 'Loading...' : 'Send Reset Link'}
      </button>
      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
