'use client'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'

const tools = ['WhatsApp', 'Search', 'Email']

export default function ToolNode({ data }: NodeProps<NodeData>) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (data) data.tool = e.target.value
  }
  return (
    <div
      className="p-2 rounded shadow w-40"
      style={{ backgroundColor: data.color || 'white' }}
    >
      <select
        className="w-full border rounded p-1"
        value={data.tool}
        onChange={onChange}
      >
        <option value="">Select tool</option>
        {tools.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}
