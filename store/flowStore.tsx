import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import type { StoreApi } from 'zustand'
import type { Node, Edge } from 'react-flow-renderer'
import type { NodeData } from '@/types'
import { getSupabaseClient } from '@/lib/supabaseClient'

export interface FlowState {
  nodes: Node<NodeData>[]
  edges: Edge[]
  flowId: string | null
  selected: Node<NodeData> | null
  setNodes: (n: Node<NodeData>[]) => void
  setEdges: (e: Edge[]) => void
  setSelected: (n: Node<NodeData> | null) => void
  load: (botId: string) => Promise<void>
  save: (botId: string) => Promise<void>
  saveData: (
    botId: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
  ) => Promise<void>
}

function createFlowStore() {
  return createStore<FlowState>((set, get) => ({
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
        .eq('bot_id', botId)
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
        bot_id: botId,
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
    async saveData(botId, nodes, edges) {
      const supabase = getSupabaseClient()
      const payload = {
        bot_id: botId,
        flowName: `bot-${botId}`,
        nodes,
        edges,
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
}

type FlowStore = StoreApi<FlowState>
const FlowStoreContext = createContext<FlowStore | null>(null)

export function FlowStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<FlowStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createFlowStore()
  }
  return (
    <FlowStoreContext.Provider value={storeRef.current}>
      {children}
    </FlowStoreContext.Provider>
  )
}

export function useFlowStore(): FlowState
export function useFlowStore<T>(selector: (state: FlowState) => T): T
export function useFlowStore<T>(selector?: (state: FlowState) => T) {
  const store = useContext(FlowStoreContext)
  if (!store) throw new Error('useFlowStore must be used within FlowStoreProvider')
  return selector ? useStore(store, selector) : useStore(store, (s) => s)
}
