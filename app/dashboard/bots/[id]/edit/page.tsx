import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import BotFlowEditor from '@/components/BotFlowEditor'

export default async function EditBotPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  const { data: bot } = await supabase
    .from('bots')
    .select('*')
    .eq('id', params.id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{bot?.name}</h1>
      <BotFlowEditor
        botId={params.id}
        initialNodes={bot?.flow_json?.nodes || []}
        initialEdges={bot?.flow_json?.edges || []}
      />
    </div>
  )
}
