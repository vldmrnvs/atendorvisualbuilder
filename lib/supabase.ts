import { createClient } from '@supabase/supabase-js'
import { validateEnv } from './validateEnv'

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC
  if (!url || !anonKey) {
    validateEnv()
  }
  return createClient(url ?? '', anonKey ?? '')
}
