import type { Node, Edge } from 'react-flow-renderer'
import type { NodeData } from '@/types'

/**
 * Serialize nodes and edges to a JSON string. Useful for persisting flows.
 */
export function serializeFlow(nodes: Node<NodeData>[], edges: Edge[]): string {
  return JSON.stringify({ nodes, edges })
}

/**
 * Deserialize a flow from JSON.
 */
export function deserializeFlow(json: string): { nodes: Node<NodeData>[]; edges: Edge[] } {
  const data = JSON.parse(json) as { nodes: Node<NodeData>[]; edges: Edge[] }
  return { nodes: data.nodes || [], edges: data.edges || [] }
}
