// @ts-nocheck
import create from 'zustand'
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
}))
