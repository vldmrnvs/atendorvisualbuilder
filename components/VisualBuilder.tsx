'use client'
import React, { useCallback, useEffect } from 'react'
import { nanoid } from 'nanoid'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
} from 'react-flow-renderer'
import PromptNode from './nodes/PromptNode'
import ToolNode from './nodes/ToolNode'
import OutputNode from './nodes/OutputNode'
import { useFlowData } from '@/hooks/useFlowData'
import type { NodeData } from '@/types'

const nodeTypes = {
  prompt: PromptNode,
  tool: ToolNode,
  output: OutputNode,
}

export default function VisualBuilder({ flowName }: { flowName: string }) {
  const { nodes: initialNodes, edges: initialEdges, setNodes, setEdges, save } =
    useFlowData(flowName)

  const [nodes, _setNodes, onNodesChange] = useNodesState<NodeData>([])
  const [edges, _setEdges, onEdgesChange] = useEdgesState([])
  const reactFlowInstance = useReactFlow()

  useEffect(() => {
    _setNodes(initialNodes)
    _setEdges(initialEdges)
  }, [initialNodes, initialEdges, _setNodes, _setEdges])

  const isValid = useCallback(
    (connection: Connection) => {
      const source = nodes.find((n) => n.id === connection.source)
      const target = nodes.find((n) => n.id === connection.target)
      if (!source || !target) return false
      if (source.type === 'prompt' && target.type === 'tool') return true
      if (source.type === 'tool' && target.type === 'output') return true
      return false
    },
    [nodes]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (isValid(connection)) {
        _setEdges((eds) =>
          addEdge({ ...connection, type: 'smoothstep' }, eds)
        )
      }
    },
    [_setEdges, isValid]
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
      const position = reactFlowInstance.project({
        x: event.clientX - 250,
        y: event.clientY,
      })
      const newNode: Node<NodeData> = {
        id: nanoid(),
        type,
        position,
        data: {},
      }
      _setNodes((nds) => [...nds, newNode])
    },
    [reactFlowInstance, _setNodes]
  )

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleSave = async () => {
    await save(nodes, edges)
  }

  useEffect(() => {
    setNodes(nodes)
  }, [nodes, setNodes])

  useEffect(() => {
    setEdges(edges)
  }, [edges, setEdges])

  return (
    <div className="flex h-[500px]">
      <div className="w-40 bg-slate-100 p-2 space-y-2 text-sm">
        <div
          className="p-2 bg-white rounded shadow cursor-grab"
          onDragStart={(e) => onDragStart(e, 'prompt')}
          draggable
        >
          Prompt
        </div>
        <div
          className="p-2 bg-white rounded shadow cursor-grab"
          onDragStart={(e) => onDragStart(e, 'tool')}
          draggable
        >
          Tool
        </div>
        <div
          className="p-2 bg-white rounded shadow cursor-grab"
          onDragStart={(e) => onDragStart(e, 'output')}
          draggable
        >
          Output
        </div>
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        <button
          onClick={handleSave}
          className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded"
        >
          Save Flow
        </button>
      </div>
    </div>
  )
}
