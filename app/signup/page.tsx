'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (isLoggedIn) router.replace('/dashboard')
  }, [isLoggedIn, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
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
        {loading ? 'Loading...' : 'Sign Up'}
      </button>
    </form>
  )
}
