'use client'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated. You can now log in.')
      router.push('/login')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <form onSubmit={handleUpdate} className="space-y-4" aria-label="Update password form">
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">New password</label>
          <input
            id="password"
            className="w-full border p-2"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={`w-full bg-black text-white p-2 ${loading ? 'animate-pulse' : ''}`} type="submit" disabled={loading}>
          Update Password
        </button>
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <Link href="/" className="text-sm text-blue-600 underline block text-center">Return home</Link>
    </div>
  )
}
