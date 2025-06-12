// @ts-nocheck
import { create } from 'zustand'
import type { FileType } from '@/types'

export type UploadedFile = {
  id: string
  name: string
  type: FileType
  size: number
  url: string
  embedded: boolean
}

export interface BotBuilderState {
  files: UploadedFile[]
  addFile: (file: UploadedFile) => void
  removeFile: (fileId: string) => void
  updateFileStatus: (fileId: string, status: 'pending' | 'embedded') => void
  loadFiles: (botId: string) => Promise<void>
}

export const useBotBuilderStore = create<BotBuilderState>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (fileId) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== fileId) })),
  updateFileStatus: (fileId, status) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, embedded: status === 'embedded' } : f
      ),
    })),
  async loadFiles(botId) {
    const supabase = (await import('@/lib/supabaseClient')).getSupabaseClient()
    const { data } = await supabase
      .from('files')
      .select('id, file_name, file_type, url, size_mb, embedded')
      .eq('bot_id', botId)
    if (data)
      set({
        files: data.map((d) => ({
          id: d.id,
          name: d.file_name,
          type: d.file_type,
          size: d.size_mb * 1024 * 1024,
          url: d.url,
          embedded: d.embedded,
        })),
      })
  },
}))
