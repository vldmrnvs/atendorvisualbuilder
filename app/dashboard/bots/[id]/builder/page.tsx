'use client'

import { FlowStoreProvider } from '@/store/flowStore'
import BotFlowBuilder from '@/components/BotFlowBuilder'
import { useUser } from '@/hooks/useUser'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useBotBuilderStore } from '@/store/botBuilderStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BotBuilderPage({ params }: { params: any }) {
  const { id } = params as { id: string }
  const { user, isLoading } = useUser()
  const supabase = createClientComponentClient()
  const loadFiles = useBotBuilderStore((s) => s.loadFiles)
  const [botName, setBotName] = useState('')
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>('starter')
  const PLAN_LIMITS = { starter: 10, pro: 30, enterprise: 100 } as const

  useEffect(() => {
    if (!user) return
    const fetchBot = async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('name, plan_level')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (error || !data) {
        toast.error('Bot not found')
        return
      }
      setBotName(data.name)
      setPlan((data.plan_level as 'starter' | 'pro' | 'enterprise') || 'starter')
      loadFiles(id)
    }
    fetchBot()
  }, [user, id, supabase, loadFiles])

  if (isLoading || !botName) return <p className="p-4">Loading...</p>

  return (
    <FlowStoreProvider>
      <BotFlowBuilder botId={id} planLimit={PLAN_LIMITS[plan]} botName={botName} />
    </FlowStoreProvider>
  )
}
