import Link from 'next/link'

export const metadata = {
  title: 'Atendor – AI Visual Builder',
  description: 'Build and manage AI flows with a visual editor.',
  openGraph: {
    title: 'Atendor – AI Visual Builder',
    description: 'Build and manage AI flows with a visual editor.',
    images: ['/og.png'],
  },
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 text-center transition-opacity">
      <h1 className="text-4xl font-bold">Atendor</h1>
      <p className="text-gray-600">Create intelligent workflows with ease.</p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 border rounded"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
