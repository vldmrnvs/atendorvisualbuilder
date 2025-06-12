'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import logo from '../assets/atendor-logo.svg'

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  return (
    <header className="border-b bg-white" role="banner">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-black">
          <Image src={logo} alt="Atendor logo" width={32} height={32} />
          <span className="font-bold">Atendor</span>
        </Link>
        <nav className="hidden md:flex space-x-6" aria-label="Main">
          <Link href="#" className="hover:underline">Home</Link>
          <Link href="#features" className="hover:underline">Features</Link>
          <Link href="#contact" className="hover:underline">Contact</Link>
          <Link href="/login" className="font-medium hover:underline">Login</Link>
        </nav>
        <button
          onClick={toggle}
          className="md:hidden p-2" aria-label="Toggle navigation"
        >
          <Menu />
        </button>
      </div>
      {open && (
        <nav className="md:hidden px-4 pb-4 space-y-2" aria-label="Mobile">
          <Link href="/" className="block" onClick={() => setOpen(false)}>Home</Link>
          <Link href="#features" className="block" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#contact" className="block" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/login" className="block" onClick={() => setOpen(false)}>Login</Link>
        </nav>
      )}
    </header>
  )
}
