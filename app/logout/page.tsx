'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClientComponentClient()
    const signOut = async () => {
      await supabase.auth.signOut()
      toast.success('Logged out')
      router.replace('/')
    }
    signOut()
  }, [router])

  return <p className="p-4">Signing out...</p>
}
