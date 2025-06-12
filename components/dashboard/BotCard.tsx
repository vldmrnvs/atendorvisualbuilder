'use client'
import { Star, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export type BotInfo = { id: string; name: string; created_at: string }

export default function BotCard({ bot }: { bot: BotInfo }) {
  const [fav, setFav] = useState(false)
  const date = new Date(bot.created_at)
  return (
    <div className="border rounded p-4 relative hover:shadow">
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        <button onClick={() => setFav((f) => !f)} aria-label="favorite">
          <Star className={`w-4 h-4 ${fav ? 'fill-yellow-400 text-yellow-500' : ''}`} />
        </button>
        <details className="relative">
          <summary className="list-none cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </summary>
          <ul className="absolute right-0 mt-1 border bg-white rounded shadow text-sm">
            <li>
              <Link href={`/dashboard/bots/${bot.id}`} className="block px-2 py-1 hover:bg-gray-100">Open</Link>
            </li>
            <li>
              <Link href={`/dashboard/bots/${bot.id}/builder`} className="block px-2 py-1 hover:bg-gray-100">Edit Flow</Link>
            </li>
          </ul>
        </details>
      </div>
      <h3 className="font-bold text-lg mb-1">
        <Link href={`/dashboard/bots/${bot.id}`}>{bot.name}</Link>
      </h3>
      <p className="text-xs text-gray-500">Created: {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
    </div>
  )
}
