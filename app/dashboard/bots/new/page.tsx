'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBotPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createBot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, flow_json: { nodes: [], edges: [] } }),
    })
    setLoading(false)
    if (res.ok) {
      const bot = await res.json()
      router.push(`/dashboard/bots/${bot.id}/edit`)
    }
  }

  return (
    <form onSubmit={createBot} className="max-w-sm mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">New Bot</h1>
      <input
        className="w-full border p-2"
        type="text"
        placeholder="Bot Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="w-full bg-black text-white p-2" type="submit">
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
