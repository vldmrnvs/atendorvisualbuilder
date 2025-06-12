'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn) router.replace('/dashboard')
  }, [isLoggedIn, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-black text-white p-2" type="submit">
        {loading ? 'Loading...' : 'Login'}
      </button>
      <Link href="/forgot-password" className="text-sm text-blue-600 underline">
        Forgot your password?
      </Link>
    </form>
  )
}
