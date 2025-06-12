import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import MyBotsGrid from '@/components/dashboard/MyBotsGrid'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
      supabaseKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return <p className="p-4">Unauthorized</p>
  }
  const { data: bots } = await supabase
    .from('bots')
    .select('id, name, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Bots</h1>
      {bots && <MyBotsGrid bots={bots} />}
    </div>
  )
}
