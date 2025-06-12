import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BotsPage() {
  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
      supabaseKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  const { data: bots } = await supabase
    .from('bots')
    .select('id, name')
    .eq('owner_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Bots</h1>
      <Link
        href="/dashboard/bots/new"
        className="mb-4 inline-block bg-black text-white p-2 rounded"
      >
        New Bot
      </Link>
      <ul className="mt-4 space-y-2">
        {bots?.map((bot) => (
          <li key={bot.id}>
            <Link href={`/dashboard/bots/${bot.id}/edit`} className="underline">
              {bot.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
