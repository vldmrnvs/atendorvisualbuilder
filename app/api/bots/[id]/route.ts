import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createRouteHandlerClient(
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createRouteHandlerClient(
    { cookies },
    {
      supabaseUrl:
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
      supabaseKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
    }
  )
  const updates = await request.json()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabase
    .from('bots')
    .update({ ...updates })
    .eq('id', id)
    .eq('owner_id', session.user.id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
