'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@/hooks/useUser'
import { toast } from 'sonner'

export default function EditBotPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useUser()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [botId, setBotId] = useState('')

  useEffect(() => {
    params.then(({ id }) => setBotId(id))
  }, [params])

  useEffect(() => {
    const fetchBot = async () => {
      if (!user || !botId) return
      const { data, error } = await supabase
        .from('bots')
        .select('name, description')
        .eq('id', botId)
        .eq('user_id', user.id)
        .single()
      if (error || !data) {
        router.replace('/dashboard/bots')
        return
      }
      setName(data.name)
      setDescription(data.description)
      setLoading(false)
    }
    if (!isLoading) fetchBot()
  }, [botId, supabase, user, isLoading, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) {
      setError('All fields are required')
      return
    }
    setError('')
    setSaving(true)
    const { error } = await supabase
      .from('bots')
      .update({ name, description })
      .eq('id', botId)
      .eq('user_id', user?.id ?? '')
    setSaving(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Bot updated')
      router.push(`/dashboard/bots/${botId}`)
    }
  }

  if (loading || isLoading) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <form onSubmit={handleUpdate} className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Edit Bot</h1>
      <input
        className="w-full border p-2"
        type="text"
        placeholder="Bot Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className={`w-full bg-black text-white p-2 ${saving ? 'animate-pulse' : ''}`}
        type="submit"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
