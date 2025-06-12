import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

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
  const { data: flows } = await supabase
    .from('flows')
    .select('id, flowName')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Flows</h1>
      <Link
        href="/dashboard/builder"
        className="inline-block px-4 py-2 bg-black text-white rounded"
      >
        Create new flow
      </Link>
      <ul className="list-disc pl-6">
        {flows?.map((flow) => (
          <li key={flow.id}>{flow.flowName}</li>
        ))}
      </ul>
    </div>
  )
}
