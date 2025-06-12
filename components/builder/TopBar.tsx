'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Home } from 'lucide-react'
import logo from '@/assets/atendor-logo.svg'
import { useUser } from '@/hooks/useUser'

export type SavingState = 'saved' | 'saving' | 'error'

export default function TopBar({ botName, onNameChange, saving }: { botName: string; onNameChange: (v: string) => void; saving: SavingState }) {
  const { user } = useUser()
  return (
    <header className="fixed top-0 inset-x-0 h-12 flex items-center justify-between bg-white border-b px-4 z-50">
      <div className="flex items-center space-x-2">
        <Image src={logo} alt="Atendor" width={24} height={24} />
        <Link href="/dashboard" className="flex items-center space-x-1 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <input
          value={botName}
          onChange={(e) => onNameChange(e.target.value)}
          className="font-semibold text-center border-b border-transparent focus:border-gray-300 focus:outline-none"
        />
        <span className="text-xs">
          {saving === 'saving' && '🟡 Saving…'}
          {saving === 'saved' && '🟢 Saved'}
          {saving === 'error' && '🔴 Disconnected'}
        </span>
        <button className="px-3 py-1 border rounded text-sm">Upgrade</button>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
          {user?.email?.[0] ?? 'U'}
        </div>
      </div>
    </header>
  )
}
