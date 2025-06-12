import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Bot } from '@/types'

const options = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
}

export async function getBotById(id: string, userId: string) {
  const supabase = createServerComponentClient({ cookies }, options)
  const { data, error } = await supabase
    .from('bots')
    .select(
      'id, name, description, plan_level, llm_profile, user_id, created_at'
    )
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) throw new Error(error.message)
  return data as Bot
}

export async function updateBot(
  id: string,
  userId: string,
  data: { name: string; description: string }
) {
  const supabase = createServerComponentClient({ cookies }, options)
  const { error } = await supabase
    .from('bots')
    .update(data)
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}
