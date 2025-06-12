import type { Edge, Node } from 'react-flow-renderer'

export type NodeData = {
  label?: string
  description?: string
  message?: string
  delay?: number
  url?: string
  method?: string
  headers?: { key: string; value: string }[]
  payload?: string
  fileId?: string
  condition?: string
  prompt?: string
  tool?: string
  output?: string
  color?: string
  text?: string
  fontFamily?: 'sans' | 'serif' | 'monospace'
  size?: 'sm' | 'md' | 'lg'
}

export type FlowType = {
  id?: string
  flowName: string
  user_id?: string
  created_at?: string
  nodes: Node<NodeData>[]
  edges: Edge[]
}

export type Bot = {
  id?: string
  name: string
  description: string
  plan_level?: 'starter' | 'pro' | 'enterprise'
  llm_profile?: 'standard' | 'advanced' | 'premium'
  user_id?: string
  created_at?: string
}

export type FileType = 'pdf' | 'text' | 'image'

export type BotFile = {
  id?: string
  bot_id: string
  file_name: string
  file_type: FileType
  url: string
  size_mb: number
  embedded: boolean
}
