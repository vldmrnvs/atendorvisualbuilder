import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import BotFlowEditor from '@/components/BotFlowEditor'

export const dynamic = 'force-dynamic'

export default async function EditBotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: bot } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{bot?.name}</h1>
      <BotFlowEditor
        botId={id}
        initialNodes={bot?.flow_json?.nodes || []}
        initialEdges={bot?.flow_json?.edges || []}
      />
    </div>
  )
}
