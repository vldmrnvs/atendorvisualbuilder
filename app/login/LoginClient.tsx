'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

export default function LoginClient() {
  const params = useSearchParams()
  const startTab = params.get('tab') === 'signup' ? 'signup' : 'login'
  const [tab, setTab] = useState<'login' | 'signup'>(startTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn) router.replace('/dashboard')
  }, [isLoggedIn, router])

  const supabase = createClientComponentClient()

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) toast.error(error.message)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast.error(error.message)
      else {
        toast.success('Logged in')
        router.push('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) toast.error(error.message)
      else {
        toast.success('Account created')
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto p-8 space-y-6" aria-labelledby="auth-heading">
      <h1 id="auth-heading" className="text-2xl font-bold text-center">Atendor</h1>
      <div className="flex justify-center gap-4" role="tablist">
        <button onClick={() => setTab('login')} className={`px-4 py-2 focus:outline-none ${tab==='login' ? 'border-b-2 border-black' : ''}`}>Login</button>
        <button onClick={() => setTab('signup')} className={`px-4 py-2 focus:outline-none ${tab==='signup' ? 'border-b-2 border-black' : ''}`}>Create Account</button>
      </div>
      <form onSubmit={handleAuth} className="space-y-4" aria-label={tab === 'login' ? 'Login form' : 'Signup form'}>
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
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            id="password"
            className="w-full border p-2"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className={`w-full bg-black text-white p-2 ${loading ? 'animate-pulse' : ''}`}
          type="submit"
          disabled={loading}
        >
          {tab === 'login' ? 'Login' : 'Create Account'}
        </button>
        {tab === 'login' && (
          <Link href="/forgot-password" className="text-sm text-blue-600 underline block">Forgot password?</Link>
        )}
      </form>
      <button onClick={handleGoogle} className="w-full border p-2" type="button">
        Continue with Google
      </button>
      <Link href="/" className="block text-center text-sm text-blue-600 underline">Return home</Link>
    </div>
  )
}
