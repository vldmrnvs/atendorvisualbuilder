'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  ReactFlowProvider,
  useReactFlow,
} from 'react-flow-renderer'
import { nanoid } from 'nanoid'
import { useFlowStore } from '@/store/flowStore'
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
import TextNode from './nodes/TextNode'
import TopBar, { SavingState } from './builder/TopBar'
import NodePalette from './builder/NodePalette'
import InspectorPanel from './builder/InspectorPanel'
import TextNodeToolbar from './builder/TextNodeToolbar'

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
  textNode: TextNode,
  end: EndNode,
}

type Props = { botId: string; planLimit: number; botName: string }

function BuilderContent({ botId, planLimit, botName }: Props) {
  const [rfNodes, setRfNodes] = useState<Node<NodeData>[]>([])
  const [rfEdges, setRfEdges] = useState<Edge[]>([])
  const [savingState, setSavingState] = useState<'saved' | 'saving' | 'error'>('saved')
  const [name, setName] = useState(botName)
  const store = useFlowStore()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const rf = useReactFlow()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    setPaletteOpen(window.innerWidth >= 768)
  }, [])

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

  useEffect(() => {
    const id = setTimeout(async () => {
      if (name !== botName) {
        await fetch(`/api/bots/${botId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        })
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [name, botId, botName])

  useEffect(() => {
    setSavingState('saving')
    const id = setTimeout(async () => {
      const nodesToSave = rfNodes.slice(0, planLimit)
      const allowedIds = new Set(nodesToSave.map((n) => n.id))
      const edgesToSave = rfEdges.filter(
        (e) => allowedIds.has(e.source) && allowedIds.has(e.target)
      )
      try {
        await store.saveData(botId, nodesToSave, edgesToSave)
        setSavingState('saved')
      } catch {
        setSavingState('error')
      }
    }, 1500)
    return () => clearTimeout(id)
  }, [rfNodes, rfEdges, botId, planLimit, store])

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


  const defaultData = (type: string): NodeData => {
    switch (type) {
      case 'wait':
        return { delay: 1 }
      case 'send':
        return { message: '' }
      case 'textNode':
        return { text: 'Text', fontFamily: 'sans', size: 'md' }
      default:
        return {}
    }
  }

  const addNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      if (type === 'start' && rfNodes.some((n) => n.type === 'start')) {
        toast.error('Only one start node allowed')
        return
      }
      const newNode: Node<NodeData> = {
        id: nanoid(),
        type,
        position:
          position ||
          rf.project({
            x: window.innerWidth / 2,
            y: (window.innerHeight - 48) / 2,
          }),
        data: defaultData(type),
      }
      if (rfNodes.length >= planLimit) {
        toast.warning('Plan limit reached. Extra nodes will not be saved')
        newNode.style = { border: '2px solid red' }
      }
      setRfNodes((nds) => [...nds, newNode])
    },
    [rfNodes, planLimit, rf]
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return
      const bounds = reactFlowWrapper.current?.getBoundingClientRect()
      const position = bounds
        ? rf.project({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          })
        : undefined
      addNode(type, position)
    },
    [addNode, rf]
  )

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }


  const selectNode = (_: React.MouseEvent, node: Node<NodeData>) => {
    store.setSelected(node)
  }

  const deleteSelected = useCallback(() => {
    const node = store.selected
    if (!node) return
    setRfNodes((nds) => nds.filter((n) => n.id !== node.id))
    setRfEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
    store.setSelected(null)
  }, [store])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Delete') deleteSelected()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [deleteSelected])

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

  const updateNodeData = (
    field: keyof NodeData,
    value: NodeData[keyof NodeData]
  ) => {
    const node = store.selected
    if (!node) return
    setRfNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, [field]: value } } : n
      )
    )
  }

  return (
    <div className="h-screen w-screen relative">
      <TopBar botName={name} onNameChange={setName} saving={savingState as SavingState} />
      {paletteOpen && <NodePalette onAdd={addNode} />}
      <button
        onClick={() => setPaletteOpen((o) => !o)}
        className="fixed top-16 left-4 z-50 md:hidden bg-white rounded shadow px-2 py-1"
      >
        {paletteOpen ? 'Close' : 'Nodes'}
      </button>
      <div
        className="fixed inset-0 top-12"
        onDrop={onDrop}
        onDragOver={onDragOver}
        ref={reactFlowWrapper}
      >
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
      </div>
      {store.selected && (
        <InspectorPanel node={store.selected} update={updateNodeData} remove={deleteSelected} />
      )}
      {store.selected?.type === 'textNode' && (
        <TextNodeToolbar
          node={store.selected}
          update={(d) =>
            Object.entries(d).forEach(([k, v]) =>
              updateNodeData(k as keyof NodeData, v as never)
            )
          }
        />
      )}
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

export default function BotFlowBuilder(props: Props) {
  return (
    <ReactFlowProvider>
      <BuilderContent {...props} />
    </ReactFlowProvider>
  )
}
