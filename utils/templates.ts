import { nanoid } from 'nanoid'
import type { Node, Edge } from 'react-flow-renderer'
import type { NodeData } from '@/types'

export type TemplateName = 'faq' | 'lead' | 'wa' | 'booking' | 'survey'
export interface FlowTemplate {
  nodes: Node<NodeData>[]
  edges: Edge[]
}

/**
 * Return predefined flow templates. Nodes come without plan limit marking.
 */
export function createTemplate(name: TemplateName): FlowTemplate {
  const base: Node<NodeData>[] = [
    { id: nanoid(), type: 'start', position: { x: 0, y: 0 }, data: {} },
    { id: nanoid(), type: 'end', position: { x: 600, y: 0 }, data: {} },
  ]
  let nodes: Node<NodeData>[] = []
  switch (name) {
    case 'faq':
      nodes = [
        base[0],
        { id: nanoid(), type: 'input', position: { x: 150, y: 0 }, data: {} },
        { id: nanoid(), type: 'file', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: {} },
        base[1],
      ]
      break
    case 'lead':
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: "What's your name?" } },
        { id: nanoid(), type: 'input', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: "What's your email?" } },
        { id: nanoid(), type: 'input', position: { x: 600, y: 0 }, data: {} },
        base[1],
      ]
      break
    case 'wa':
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'Hello! Welcome \u{1F44B}' } },
        { id: nanoid(), type: 'wait', position: { x: 300, y: 0 }, data: { delay: 2 } },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: 'How can I help you today?' } },
        base[1],
      ]
      break
    case 'booking':
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'What day would you like to book?' } },
        { id: nanoid(), type: 'input', position: { x: 350, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 550, y: 0 }, data: { message: 'Booking confirmed!' } },
        base[1],
      ]
      break
    case 'survey':
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'Rate us 1-5' } },
        { id: nanoid(), type: 'input', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: 'Thanks!' } },
        base[1],
      ]
      break
  }
  const edges: Edge[] = nodes.slice(0, -1).map((n, i) => ({
    id: nanoid(),
    source: n.id,
    target: nodes[i + 1].id,
    type: 'smoothstep',
  }))
  return { nodes, edges }
}
