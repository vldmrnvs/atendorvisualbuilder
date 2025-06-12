import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { BotFile, FileType } from '@/types'

export const FILE_TYPE_EXTENSIONS: Record<FileType, string[]> = {
  pdf: ['.pdf'],
  text: ['.txt', '.md', '.csv'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
}

const options = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC!,
}

export function getFileTypeFromExtension(ext: string): FileType | null {
  const lower = ext.toLowerCase()
  for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS) as [
    FileType,
    string[]
  ][]) {
    if (extensions.includes(lower)) return type
  }
  return null
}

export class FilesCrud {
  async create(
    botId: string,
    file: { name: string; url: string; size_mb: number }
  ) {
    const extension = `.${file.name.split('.').pop() || ''}`.toLowerCase()
    const file_type = getFileTypeFromExtension(extension)
    if (!file_type) {
      throw new Error(`Unsupported extension ${extension}`)
    }
    const supabase = createServerComponentClient({ cookies }, options)
    const { data, error } = await supabase
      .from('files')
      .insert({
        bot_id: botId,
        file_name: file.name,
        file_type,
        url: file.url,
        size_mb: file.size_mb,
        embedded: false,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as BotFile
  }

  async uploadAndCreate({
    botId,
    file,
  }: {
    botId: string
    file: File
  }) {
    const extension = `.${file.name.split('.').pop() || ''}`.toLowerCase()
    if (
      !Object.values(FILE_TYPE_EXTENSIONS)
        .flat()
        .includes(extension)
    ) {
      throw new Error(`Unsupported extension ${extension}`)
    }
    const supabase = createServerComponentClient({ cookies }, options)
    const { data, error } = await supabase.storage
      .from('bot-files')
      .upload(`${botId}/${file.name}`, file, { upsert: true })
    if (error) throw new Error(error.message)
    const {
      data: { publicUrl },
    } = supabase.storage.from('bot-files').getPublicUrl(`${botId}/${file.name}`)
    const record = await this.create(botId, {
      name: file.name,
      url: publicUrl,
      size_mb: file.size / 1024 / 1024,
    })
    return record
  }
}
