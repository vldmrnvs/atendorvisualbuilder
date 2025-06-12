import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  const { data: bot } = await supabase
    .from('bots')
    .select('id, name, description')
    .eq('id', id)
    .single()

  if (!bot) {
    return <p className="p-4">Bot not found.</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{bot.name}</h1>
      <p>{bot.description}</p>
      <Link href={`/dashboard/bots/${bot.id}/edit`} className="text-blue-600 underline">
        Edit Bot
      </Link>
    </div>
  )
}
