import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-600 underline">Go back home</Link>
    </main>
  )
}
