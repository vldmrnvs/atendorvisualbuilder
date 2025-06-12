'use client'
import type { Node } from 'react-flow-renderer'
import type { NodeData } from '@/types'
import { useBotBuilderStore } from '@/store/botBuilderStore'

export default function InspectorPanel({ node, update, remove }: { node: Node<NodeData>; update: (field: keyof NodeData, value: NodeData[keyof NodeData]) => void; remove: () => void }) {
  const files = useBotBuilderStore((s) => s.files)
  return (
    <aside className="fixed top-16 right-4 w-60 bg-white rounded shadow p-4 space-y-2 text-sm z-50">
      <h2 className="font-semibold mb-2">Node Settings</h2>
      <div>
        {['send', 'start', 'end', 'webhook', 'file-search', 'http'].includes(node.type ?? '') && (
          <div className="mb-2">
            <label className="block mb-1" htmlFor="label">Label</label>
            <input id="label" className="w-full border p-1" value={node.data.label || ''} onChange={(e) => update('label', e.target.value)} />
          </div>
        )}
        <div className="mb-2">
          <label className="block mb-1" htmlFor="description">Description</label>
          <input id="description" className="w-full border p-1" value={node.data.description || ''} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="color">Color</label>
          <input id="color" type="color" className="w-full border p-1 h-8" value={node.data.color || '#ffffff'} onChange={(e) => update('color', e.target.value)} />
        </div>
        {node.type === 'send' && (
          <div className="mb-2">
            <label className="block mb-1" htmlFor="message">Message</label>
            <textarea id="message" className="w-full border p-1" value={node.data.message || ''} onChange={(e) => update('message', e.target.value)} />
          </div>
        )}
        {node.type === 'wait' && (
          <div className="mb-2">
            <label className="block mb-1" htmlFor="delay">Delay (s)</label>
            <input id="delay" type="number" className="w-full border p-1" value={node.data.delay ?? 1} onChange={(e) => update('delay', Number(e.target.value))} />
          </div>
        )}
        {node.type === 'http' && (
          <div className="mb-2">
            <label className="block mb-1" htmlFor="url">URL</label>
            <input id="url" className="w-full border p-1" value={node.data.url || ''} onChange={(e) => update('url', e.target.value)} />
          </div>
        )}
        {node.type === 'webhook' && (
          <div className="space-y-2">
            <div className="mb-2">
              <label className="block mb-1" htmlFor="wh-url">Webhook URL</label>
              <input id="wh-url" className="w-full border p-1" value={node.data.url || ''} onChange={(e) => update('url', e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="block mb-1" htmlFor="wh-method">Method</label>
              <select id="wh-method" className="w-full border p-1" value={node.data.method || 'POST'} onChange={(e) => update('method', e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>
        )}
        {node.type === 'file-search' && (
          <div className="space-y-2">
            <div className="mb-2">
              <label className="block mb-1" htmlFor="fs-file">File</label>
              <select id="fs-file" className="w-full border p-1" value={node.data.fileId || ''} onChange={(e) => update('fileId', e.target.value)}>
                <option value="">Select file</option>
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1" htmlFor="fs-prompt">User prompt</label>
              <textarea id="fs-prompt" className="w-full border p-1" value={node.data.prompt || ''} onChange={(e) => update('prompt', e.target.value)} />
            </div>
          </div>
        )}
        {node.type === 'textNode' && (
          <div className="space-y-2">
            <div className="mb-2">
              <label className="block mb-1" htmlFor="tn-text">Text</label>
              <textarea id="tn-text" className="w-full border p-1" value={node.data.text || ''} onChange={(e) => update('text', e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="block mb-1" htmlFor="tn-font">Font</label>
              <select id="tn-font" className="w-full border p-1" value={node.data.fontFamily || 'sans'} onChange={(e) => update('fontFamily', e.target.value as 'sans' | 'serif' | 'monospace')}>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="monospace">Mono</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1" htmlFor="tn-size">Size</label>
              <select id="tn-size" className="w-full border p-1" value={node.data.size || 'md'} onChange={(e) => update('size', e.target.value as 'sm' | 'md' | 'lg')}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        )}
        <button onClick={remove} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
          Delete
        </button>
      </div>
    </aside>
  )
}
