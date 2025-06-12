'use client'
import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  EdgeChange,
  NodeChange,
} from 'react-flow-renderer'
import { nanoid } from 'nanoid'
import { useFlowStore } from '@/store/flowStore'
import { useBotBuilderStore } from '@/store/botBuilderStore'
import type { NodeData } from '@/types'
import { toast } from 'sonner'
import StartNode from './nodes/StartNode'
import SendMessageNode from './nodes/SendMessageNode'
import WaitNode from './nodes/WaitNode'
import ReceiveInputNode from './nodes/ReceiveInputNode'
import FileLookupNode from './nodes/FileLookupNode'
import HttpRequestNode from './nodes/HttpRequestNode'
import DecisionNode from './nodes/DecisionNode'
import EndNode from './nodes/EndNode'
import WebhookNode from './nodes/WebhookNode'
import FileSearchNode from './nodes/FileSearchNode'

const nodeTypes = {
  start: StartNode,
  send: SendMessageNode,
  wait: WaitNode,
  input: ReceiveInputNode,
  file: FileLookupNode,
  'file-search': FileSearchNode,
  webhook: WebhookNode,
  http: HttpRequestNode,
  decision: DecisionNode,
  end: EndNode,
}

type Props = { botId: string; planLimit: number }

export default function BotFlowBuilder({ botId, planLimit }: Props) {
  const [rfNodes, setRfNodes] = useState<Node<NodeData>[]>([])
  const [rfEdges, setRfEdges] = useState<Edge[]>([])
  const store = useFlowStore()
  const files = useBotBuilderStore((s) => s.files)

  useEffect(() => {
    store.load(botId)
  }, [botId, store])

  const markLimit = useCallback(
    (nodes: Node<NodeData>[]) =>
      nodes.map((n, i) =>
        i >= planLimit
          ? { ...n, style: { ...n.style, border: '2px solid red' } }
          : { ...n, style: { ...n.style, border: undefined } }
      ),
    [planLimit]
  )

  useEffect(() => {
    setRfNodes(markLimit(store.nodes))
  }, [store.nodes, store, markLimit])

  useEffect(() => {
    setRfEdges(store.edges)
  }, [store.edges, store])

  useEffect(() => {
    store.setNodes(rfNodes)
  }, [rfNodes, store])

  useEffect(() => {
    setRfNodes((nodes) => markLimit(nodes))
  }, [markLimit])

  useEffect(() => {
    store.setEdges(rfEdges)
  }, [rfEdges, store])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setRfNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setRfEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )
  const onConnect = useCallback(
    (connection: Connection) =>
      setRfEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds)),
    []
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return
      if (type === 'start' && rfNodes.some((n) => n.type === 'start')) {
        toast.error('Only one start node allowed')
        return
      }
      const position = (event.target as HTMLElement).getBoundingClientRect()
      const newNode: Node<NodeData> = {
        id: nanoid(),
        type,
        position: { x: event.clientX - position.left, y: event.clientY - position.top },
        data: {},
      }
      if (rfNodes.length >= planLimit) {
        toast.warning('Plan limit reached. Extra nodes will not be saved')
        newNode.style = { border: '2px solid red' }
      }
      setRfNodes((nds) => [...nds, newNode])
    },
    [rfNodes, planLimit]
  )

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const save = async () => {
    const nodesToSave = rfNodes.slice(0, planLimit)
    const allowedIds = new Set(nodesToSave.map((n) => n.id))
    const edgesToSave = rfEdges.filter(
      (e) => allowedIds.has(e.source) && allowedIds.has(e.target)
    )
    try {
      await store.saveData(botId, nodesToSave, edgesToSave)
      toast.success('Flow saved')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(msg)
    }
  }

  const selectNode = (_: React.MouseEvent, node: Node<NodeData>) => {
    store.setSelected(node)
  }

  const deleteSelected = () => {
    const node = store.selected
    if (!node) return
    setRfNodes((nds) => nds.filter((n) => n.id !== node.id))
    setRfEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
    store.setSelected(null)
  }

  // Templates
  const [showTemplates, setShowTemplates] = useState(false)
  const applyTemplate = (name: string) => {
    const base = [
      { id: nanoid(), type: 'start', position: { x: 0, y: 0 }, data: {} },
      { id: nanoid(), type: 'end', position: { x: 600, y: 0 }, data: {} },
    ]
    let nodes: Node<NodeData>[] = []
    let edges: Edge[] = []
    if (name === 'faq') {
      nodes = [
        base[0],
        { id: nanoid(), type: 'input', position: { x: 150, y: 0 }, data: {} },
        { id: nanoid(), type: 'file', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: {} },
        base[1],
      ]
    } else if (name === 'lead') {
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: "What's your name?" } },
        { id: nanoid(), type: 'input', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: "What's your email?" } },
        { id: nanoid(), type: 'input', position: { x: 600, y: 0 }, data: {} },
        base[1],
      ]
    } else if (name === 'wa') {
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'Hello! Welcome 👋' } },
        { id: nanoid(), type: 'wait', position: { x: 300, y: 0 }, data: { delay: 2 } },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: 'How can I help you today?' } },
        base[1],
      ]
    } else if (name === 'booking') {
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'What day would you like to book?' } },
        { id: nanoid(), type: 'input', position: { x: 350, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 550, y: 0 }, data: { message: 'Booking confirmed!' } },
        base[1],
      ]
    } else if (name === 'survey') {
      nodes = [
        base[0],
        { id: nanoid(), type: 'send', position: { x: 150, y: 0 }, data: { message: 'Rate us 1-5' } },
        { id: nanoid(), type: 'input', position: { x: 300, y: 0 }, data: {} },
        { id: nanoid(), type: 'send', position: { x: 450, y: 0 }, data: { message: 'Thanks!' } },
        base[1],
      ]
    }
    // edges sequential
    edges = nodes.slice(0, -1).map((n, i) => ({
      id: nanoid(),
      source: n.id,
      target: nodes[i + 1].id,
      type: 'smoothstep',
    }))
    if (nodes.length > planLimit) {
      toast.warning('Template exceeds plan limit. Extra nodes marked in red')
    }
    setRfNodes(markLimit(nodes))
    setRfEdges(edges)
    setShowTemplates(false)
  }

  const updateNodeData = (field: keyof NodeData, value: string | number) => {
    const node = store.selected
    if (!node) return
    setRfNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, [field]: value } } : n
      )
    )
  }

  return (
    <div className="flex h-[600px] border rounded overflow-hidden">
      <div className="w-40 bg-slate-100 p-2 space-y-2" aria-label="Node palette">
        {[
          ['start', 'Start'],
          ['send', 'Send Message'],
          ['wait', 'Wait'],
          ['input', 'Receive Input'],
          ['file', 'File Lookup'],
          ['file-search', 'File Search'],
          ['webhook', 'Webhook'],
          ['http', 'HTTP Request'],
          ['decision', 'Decision'],
          ['end', 'End'],
        ].map(([type, label]) => (
          <div
            key={type}
            role="button"
            tabIndex={0}
            className="p-2 bg-white rounded shadow cursor-grab"
            onDragStart={(e) => onDragStart(e, type)}
            draggable
          >
            {label}
          </div>
        ))}
      </div>
      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={selectNode}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        <button
          onClick={() => setShowTemplates(true)}
          className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border px-3 py-1 rounded text-sm"
        >
          + Templates
        </button>
        <div className="absolute top-2 right-2 space-x-2">
          <button
            onClick={save}
            className="bg-black text-white px-3 py-1 rounded text-sm"
            aria-label="Save Flow"
          >
            Save Flow
          </button>
        </div>
      </div>
      <aside className="w-60 border-l p-4 space-y-2 text-sm">
        <div className="text-xs text-gray-500" aria-live="polite">
          Upgrade your plan to unlock more AI power
        </div>
        {store.selected && (
          <div>
            <h2 className="font-semibold mb-2">Node Settings</h2>
            {['send', 'start', 'end', 'webhook', 'file-search', 'http'].includes(
              store.selected.type ?? ''
            ) && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="label">Label</label>
                <input
                  id="label"
                  className="w-full border p-1"
                  value={store.selected.data.label || ''}
                  onChange={(e) => updateNodeData('label', e.target.value)}
                />
              </div>
            )}
            {store.selected && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="description">Description</label>
                <input
                  id="description"
                  className="w-full border p-1"
                  value={store.selected.data.description || ''}
                  onChange={(e) => updateNodeData('description', e.target.value)}
                />
              </div>
            )}
            {store.selected && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="color">Color</label>
                <input
                  id="color"
                  type="color"
                  className="w-full border p-1 h-8"
                  value={store.selected.data.color || '#ffffff'}
                  onChange={(e) => updateNodeData('color', e.target.value)}
                />
              </div>
            )}
            {store.selected.type === 'send' && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="w-full border p-1"
                  value={store.selected.data.message || ''}
                  onChange={(e) => updateNodeData('message', e.target.value)}
                />
              </div>
            )}
            {store.selected.type === 'wait' && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="delay">Delay (s)</label>
                <input
                  id="delay"
                  type="number"
                  className="w-full border p-1"
                  value={store.selected.data.delay ?? 1}
                  onChange={(e) => updateNodeData('delay', Number(e.target.value))}
                />
              </div>
            )}
            {store.selected.type === 'http' && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="url">URL</label>
                <input
                  id="url"
                  className="w-full border p-1"
                  value={store.selected.data.url || ''}
                  onChange={(e) => updateNodeData('url', e.target.value)}
                />
              </div>
            )}
            {store.selected.type === 'webhook' && (
              <div className="space-y-2">
                <div className="mb-2">
                  <label className="block mb-1" htmlFor="wh-url">Webhook URL</label>
                  <input
                    id="wh-url"
                    className="w-full border p-1"
                    value={store.selected.data.url || ''}
                    onChange={(e) => updateNodeData('url', e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1" htmlFor="wh-method">Method</label>
                  <select
                    id="wh-method"
                    className="w-full border p-1"
                    value={store.selected.data.method || 'POST'}
                    onChange={(e) => updateNodeData('method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1" htmlFor="wh-headers">Headers</label>
                  <textarea
                    id="wh-headers"
                    className="w-full border p-1"
                    value={(store.selected.data.headers || [])
                      .map((h) => `${h.key}:${h.value}`)
                      .join('\n')}
                    onChange={(e) =>
                      updateNodeData(
                        'headers',
                        e.target.value
                          .split('\n')
                          .map((l) => {
                            const [key, ...rest] = l.split(':')
                            return { key: key.trim(), value: rest.join(':').trim() }
                          })
                          .filter((h) => h.key)
                      )
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1" htmlFor="wh-payload">Payload</label>
                  <textarea
                    id="wh-payload"
                    className="w-full border p-1"
                    value={store.selected.data.payload || ''}
                    onChange={(e) => updateNodeData('payload', e.target.value)}
                  />
                </div>
              </div>
            )}
            {store.selected.type === 'file-search' && (
              <div className="space-y-2">
                <div className="mb-2">
                  <label className="block mb-1" htmlFor="fs-file">File</label>
                  <select
                    id="fs-file"
                    className="w-full border p-1"
                    value={store.selected.data.fileId || ''}
                    onChange={(e) => updateNodeData('fileId', e.target.value)}
                  >
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
                  <textarea
                    id="fs-prompt"
                    className="w-full border p-1"
                    value={store.selected.data.prompt || ''}
                    onChange={(e) => updateNodeData('prompt', e.target.value)}
                  />
                </div>
              </div>
            )}
            {store.selected.type === 'decision' && (
              <div className="mb-2">
                <label className="block mb-1" htmlFor="condition">Condition</label>
                <input
                  id="condition"
                  className="w-full border p-1"
                  value={store.selected.data.condition || ''}
                  onChange={(e) => updateNodeData('condition', e.target.value)}
                />
              </div>
            )}
            <button
              onClick={deleteSelected}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </aside>
      {showTemplates && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Template picker"
        >
          <div className="bg-white p-4 rounded space-y-4 w-72">
            <h2 className="font-semibold text-center">Select Template</h2>
            <button aria-label="Apply FAQ template" className="w-full border p-2" onClick={() => applyTemplate('faq')}>
              FAQ Bot
            </button>
            <button aria-label="Apply Lead Collector template" className="w-full border p-2" onClick={() => applyTemplate('lead')}>
              Lead Collector Bot
            </button>
            <button aria-label="Apply WhatsApp template" className="w-full border p-2" onClick={() => applyTemplate('wa')}>
              WhatsApp Greeter Bot
            </button>
            <button aria-label="Apply Booking template" className="w-full border p-2" onClick={() => applyTemplate('booking')}>
              Booking Bot
            </button>
            <button aria-label="Apply Survey template" className="w-full border p-2" onClick={() => applyTemplate('survey')}>
              Survey Bot
            </button>
            <button className="w-full border p-2" onClick={() => setShowTemplates(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
