'use client'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'
export default function WaitNode({ data }: NodeProps<NodeData>) {
  const delay = data.delay ?? 1
  return (
    <div
      className="p-2 rounded shadow w-40 text-sm text-center"
      style={{ backgroundColor: data.color || 'white' }}
    >
      Wait {delay}s
    </div>
  )
}
