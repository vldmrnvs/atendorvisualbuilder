import type { Edge, Node } from 'react-flow-renderer'

export type NodeData = {
  prompt?: string
  tool?: string
  output?: string
}

export type FlowType = {
  id?: string
  flowName: string
  user_id?: string
  created_at?: string
  nodes: Node<NodeData>[]
  edges: Edge[]
}
