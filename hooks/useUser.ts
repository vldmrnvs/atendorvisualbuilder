'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setIsLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading, isLoggedIn: !!user }
}
