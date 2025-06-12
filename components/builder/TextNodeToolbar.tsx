'use client'
import type { Node } from 'react-flow-renderer'
import type { NodeData } from '@/types'

export default function TextNodeToolbar({ node, update }: { node: Node<NodeData>; update: (data: Partial<NodeData>) => void }) {
  return (
    <div
      className="absolute z-50 bg-white rounded shadow p-1 space-x-1 text-xs"
      style={{ left: node.position.x, top: node.position.y - 40 }}
    >
      <select
        className="border text-xs"
        value={node.data.fontFamily || 'sans'}
        onChange={(e) =>
          update({ fontFamily: e.target.value as 'sans' | 'serif' | 'monospace' })
        }
      >
        <option value="sans">Sans</option>
        <option value="serif">Serif</option>
        <option value="monospace">Mono</option>
      </select>
      <select
        className="border text-xs"
        value={node.data.size || 'md'}
        onChange={(e) => update({ size: e.target.value as 'sm' | 'md' | 'lg' })}
      >
        <option value="sm">Sm</option>
        <option value="md">Md</option>
        <option value="lg">Lg</option>
      </select>
    </div>
  )
}
