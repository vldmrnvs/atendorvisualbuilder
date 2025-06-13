"use client"

import Sidebar from '@/components/Sidebar'
import { useUser } from '@/hooks/useUser'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b text-right text-sm text-gray-600">
          {user?.email}
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
