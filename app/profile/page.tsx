'use client'
import { useUser } from '@/hooks/useUser'

export default function ProfilePage() {
  const { user, isLoading } = useUser()

  if (isLoading) return <p className="p-4">Loading...</p>
  if (!user) return <p className="p-4">No user found.</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div>Email: {user.email}</div>
      <div>Role: {user.user_metadata?.role ?? 'user'}</div>
      {user.user_metadata && (
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(user.user_metadata, null, 2)}
        </pre>
      )}
    </div>
  )
}
