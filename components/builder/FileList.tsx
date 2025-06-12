'use client'
import { FileText, Image as ImageIcon, File as GenericFile } from 'lucide-react'
import { useBotBuilderStore } from '@/store/botBuilderStore'
import type { UploadedFile, BotBuilderState } from '@/store/botBuilderStore'

const iconFor = (type: UploadedFile['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-4 h-4" />
    case 'image':
      return <ImageIcon className="w-4 h-4" />
    default:
      return <GenericFile className="w-4 h-4" />
  }
}

export function FileList() {
  const files = useBotBuilderStore((s: BotBuilderState) => s.files)
  if (files.length === 0) {
    return <p className="text-sm text-gray-500">No files uploaded.</p>
  }
  return (
    <ul className="space-y-2">
      {files.map((f: UploadedFile) => (
        <li
          key={f.id}
          className="flex items-center justify-between border p-2 rounded"
        >
          <div className="flex items-center space-x-2">
            {iconFor(f.type)}
            <span>{f.name}</span>
            <span className="text-xs text-gray-500">
              {(f.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${f.embedded ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}
          >
            {f.embedded ? 'Embedded' : 'Pending'}
          </span>
        </li>
      ))}
    </ul>
  )
}
