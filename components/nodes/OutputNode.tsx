'use client'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'

export default function OutputNode({ data }: NodeProps<NodeData>) {
  return (
    <div className="p-2 bg-white rounded shadow w-40 text-sm">
      {data.output || 'Output'}
    </div>
  )
}
