import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  const { botId, fileId } = await request.json()
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
    .select('user_id')
    .eq('id', botId)
    .single()
  if (!bot || bot.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single()
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
  const { data: download, error: downloadError } = await supabase.storage
    .from('bot-files')
    .download(`${botId}/${file.file_name}`)
  if (downloadError || !download) {
    return NextResponse.json({ error: downloadError?.message }, { status: 500 })
  }
  const text = await download.text()
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key')
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const embedding = await openai.embeddings
    .create({ model: 'text-embedding-ada-002', input: text })
    .then((res) => res.data[0].embedding)
  await supabase.from('file_vectors').insert({ file_id: fileId, embedding })
  await supabase.from('files').update({ embedded: true }).eq('id', fileId)
  return NextResponse.json({ success: true })
}
