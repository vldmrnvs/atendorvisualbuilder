'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function CreateBotCard() {
  return (
    <Link href="/dashboard/bots/new" className="border-dashed border-2 rounded flex flex-col items-center justify-center p-4 hover:bg-gray-50">
      <Plus className="w-6 h-6" />
      <span className="mt-2">Create New Bot</span>
    </Link>
  )
}
