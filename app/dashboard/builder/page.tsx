'use client'
import VisualBuilder from '@/components/VisualBuilder'
import { useUser } from '@/hooks/useUser'

export default function BuilderPage() {
  const { isLoading } = useUser()
  if (isLoading) return <p className="p-4">Loading...</p>
  return <VisualBuilder flowName="default" />
}
