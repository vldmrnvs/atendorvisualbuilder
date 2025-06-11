'use client'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'

export default function PromptNode({ data }: NodeProps<NodeData>) {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data) data.prompt = e.target.value
  }
  return (
    <div className="p-2 bg-white rounded shadow w-48">
      <textarea
        className="w-full border rounded p-1"
        placeholder="Prompt..."
        value={data.prompt}
        onChange={onChange}
      />
    </div>
  )
}
