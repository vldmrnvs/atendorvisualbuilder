import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Node, Edge } from 'react-flow-renderer'
import type { NodeData } from '@/types'
import { getSupabaseClient } from '@/lib/supabaseClient'

interface FlowState {
  nodes: Node<NodeData>[]
  edges: Edge[]
  flowId: string | null
  selected: Node<NodeData> | null
  setNodes: (n: Node<NodeData>[]) => void
  setEdges: (e: Edge[]) => void
  setSelected: (n: Node<NodeData> | null) => void
  load: (botId: string) => Promise<void>
  save: (botId: string) => Promise<void>
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  flowId: null,
  selected: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelected: (selected) => set({ selected }),
  async load(botId) {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('flows')
      .select('*')
      .eq('flowName', `bot-${botId}`)
      .single()
    if (data) {
      set({ flowId: data.id, nodes: data.nodes || [], edges: data.edges || [] })
    } else {
      set({ nodes: [], edges: [], flowId: null })
    }
  },
  async save(botId) {
    const supabase = getSupabaseClient()
    const payload = {
      flowName: `bot-${botId}`,
      nodes: get().nodes,
      edges: get().edges,
    }
    if (get().flowId) {
      await supabase.from('flows').update(payload).eq('id', get().flowId!)
    } else {
      const { data } = await supabase
        .from('flows')
        .insert(payload)
        .select()
        .single()
      if (data) set({ flowId: data.id })
    }
  },
}))
