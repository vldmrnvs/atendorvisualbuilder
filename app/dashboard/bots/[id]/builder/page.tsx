'use client'
import { UploadArea } from '@/components/builder/UploadArea'
import { FileList } from '@/components/builder/FileList'
import { useUser } from '@/hooks/useUser'

export default function BotBuilderPage({ params }: { params: { id: string } }) {
  const { isLoading } = useUser()
  if (isLoading) return <p className="p-4">Loading...</p>
  const { id } = params
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Bot Builder</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Files</h2>
        <UploadArea botId={id} />
        <FileList />
      </section>
    </div>
  )
}
