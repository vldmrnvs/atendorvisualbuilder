'use client'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'
export default function SendMessageNode({ data }: NodeProps<NodeData>) {
  return (
    <div
      className="p-2 rounded shadow w-40 text-sm"
      style={{ backgroundColor: data.color || 'white' }}
    >
      {data.message || 'Send Message'}
    </div>
  )
}
