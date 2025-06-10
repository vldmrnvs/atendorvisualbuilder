'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function HeaderDashboard() {
  const [email, setEmail] = useState<string>('')
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? '')
    }
    getUser()
  }, [])
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {email && <span className="text-sm text-gray-600">{email}</span>}
    </header>
  )
}
