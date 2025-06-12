'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { FilesCrud, FILE_TYPE_EXTENSIONS } from '@/lib/actions/files'
import { useBotBuilderStore } from '@/store/botBuilderStore'

export function UploadArea({ botId }: { botId: string }) {
  const [loading, setLoading] = useState(false)
  const addFile = useBotBuilderStore((s) => s.addFile)
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const allowed = Object.values(FILE_TYPE_EXTENSIONS).flat()
    const crud = new FilesCrud()
    for (const file of Array.from(files)) {
      const ext = `.${file.name.split('.').pop()}`.toLowerCase()
      if (!allowed.includes(ext)) {
        toast.error(`Unsupported file type: ${ext}`)
        continue
      }
      setLoading(true)
      try {
        const record = await crud.uploadAndCreate({ botId, file })
        addFile({
          id: record.id!,
          name: record.file_name,
          type: record.file_type,
          size: file.size,
          url: record.url,
          embedded: record.embedded,
        })
        await fetch('/api/embed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botId, fileId: record.id }),
        })
          .then(() =>
            useBotBuilderStore.getState().updateFileStatus(
              record.id!,
              'embedded'
            )
          )
        toast.success(`${file.name} uploaded`)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
    e.target.value = ''
  }
  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        onChange={handleChange}
        disabled={loading}
        className="file-input file-input-bordered w-full"
      />
      {loading && <p className="text-sm">Uploading...</p>}
    </div>
  )
}
