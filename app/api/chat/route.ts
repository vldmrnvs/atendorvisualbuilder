import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type PlanLevel = 'starter' | 'pro' | 'enterprise'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

async function groqChat(model: string, messages: ChatMessage[]) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model, messages }),
  })
  return res.json()
}

async function openrouterChat(model: string, messages: ChatMessage[]) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.OPENROUTER_REFERER || '',
      'X-Title': 'Atendor',
    },
    body: JSON.stringify({ model, messages }),
  })
  return res.json()
}

async function selectModelByPlan(plan: PlanLevel, messages: ChatMessage[]) {
  switch (plan) {
    case 'starter':
      return groqChat('mistral-7b', messages)
    case 'pro':
      return openrouterChat('gpt-4-turbo', messages)
    case 'enterprise':
      return openrouterChat('claude-3-opus', messages)
    default:
      return groqChat('mistral-7b', messages)
  }
}

export async function POST(request: Request) {
  const { botId, messages } = await request.json()
  const supabase = createRouteHandlerClient(
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data: bot } = await supabase
    .from('bots')
    .select('plan_level')
    .eq('id', botId)
    .eq('user_id', session.user.id)
    .single()
  const plan = (bot?.plan_level ?? 'starter') as PlanLevel
  const aiResponse = await selectModelByPlan(plan, messages)
  return NextResponse.json(aiResponse)
}
