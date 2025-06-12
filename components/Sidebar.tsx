'use client'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../assets/atendor-logo.svg'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Image src={logo} alt="Atendor" width={40} height={40} />
        <span className="text-xl font-bold">Atendor</span>
      </div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">
          Dashboard
        </Link>
        <Link href="/dashboard/builder" className="block p-2 rounded hover:bg-gray-200">
          Builder
        </Link>
        <Link href="/profile" className="block p-2 rounded hover:bg-gray-200">
          Profile
        </Link>
        <Link href="/logout" className="block p-2 rounded hover:bg-gray-200">
          Logout
        </Link>
      </nav>
    </aside>
  )
}
