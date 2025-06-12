'use client'
import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import type { FlowType } from '@/types'
import type { Node, Edge } from 'react-flow-renderer'

export function useFlowData(flowName: string) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [flowId, setFlowId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    const fetchFlow = async () => {
      const { data } = await supabase
        .from('flows')
        .select('*')
        .eq('flowName', flowName)
        .single()
      if (data) {
        setFlowId(data.id)
        setNodes(data.nodes || [])
        setEdges(data.edges || [])
      }
    }
    fetchFlow()
  }, [flowName])

  const save = async (newNodes: Node[], newEdges: Edge[]) => {
    const payload: Partial<FlowType> = {
      flowName,
      nodes: newNodes,
      edges: newEdges,
    }
    const supabase = getSupabaseClient()
    if (flowId) {
      await supabase.from('flows').update(payload).eq('id', flowId)
    } else {
      const { data } = await supabase
        .from('flows')
        .insert(payload)
        .select()
        .single()
      if (data) setFlowId(data.id)
    }
  }

  return { nodes, edges, setNodes, setEdges, save }
}
