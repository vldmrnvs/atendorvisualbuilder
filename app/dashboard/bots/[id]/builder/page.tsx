'use client'
import { UploadArea } from '@/components/builder/UploadArea'
import { FileList } from '@/components/builder/FileList'
import { useUser } from '@/hooks/useUser'
import BotFlowBuilder from '@/components/BotFlowBuilder'
import Link from 'next/link'
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
    <div className="p-4 space-y-6">
      <nav className="text-sm" aria-label="Breadcrumb">
        <ol className="list-reset flex space-x-1">
          <li>
            <Link href="/dashboard" className="text-blue-600 underline">Dashboard</Link> /
          </li>
          <li>
            <Link href="/dashboard/bots" className="text-blue-600 underline">Bots</Link> /
          </li>
          <li>
            <Link href={`/dashboard/bots/${id}`} className="text-blue-600 underline">{botName}</Link> /
          </li>
          <li aria-current="page">Builder</li>
        </ol>
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{botName} Builder</h1>
        <button
          onClick={() => alert('Preview coming soon')}
          className="border px-3 py-1 rounded"
        >
          Preview Chat
        </button>
      </div>
      <BotFlowBuilder botId={id} planLimit={PLAN_LIMITS[plan]} />
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Settings</h2>
        <span className="text-sm text-muted-foreground">
          Your bot is powered by: <strong>Advanced AI</strong> (based on your plan)
        </span>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Files</h2>
        <UploadArea botId={id} />
        <FileList />
      </section>
    </div>
  )
}
