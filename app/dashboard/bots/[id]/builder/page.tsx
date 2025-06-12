'use client'
import { UploadArea } from '@/components/builder/UploadArea'
import { FileList } from '@/components/builder/FileList'
import { useUser } from '@/hooks/useUser'
import BotFlowBuilder from '@/components/BotFlowBuilder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BotBuilderPage({ params }: { params: any }) {
  const { id } = params as { id: string }
  const { isLoading } = useUser()
  if (isLoading) return <p className="p-4">Loading...</p>
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Bot Builder</h1>
      <BotFlowBuilder botId={id} />
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Settings</h2>
        <span className="text-sm text-muted-foreground">
          Your bot is powered by: <strong>Advanced AI</strong> (based on your plan)
        </span>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Files</h2>
        <UploadArea botId={id} />
        <FileList />
      </section>
    </div>
  )
}
