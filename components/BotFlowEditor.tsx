'use client'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  EdgeChange,
  NodeChange,
} from 'react-flow-renderer'
import { useCallback, useState } from 'react'

type Props = {
  botId: string
  initialNodes: Node[]
  initialEdges: Edge[]
}

export default function BotFlowEditor({ botId, initialNodes, initialEdges }: Props) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  const saveFlow = async () => {
    await fetch(`/api/bots/${botId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flow_json: { nodes, edges } }),
    })
  }

  return (
    <div className="h-[500px] bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <button className="mt-4 p-2 bg-black text-white" onClick={saveFlow}>
        Save
      </button>
    </div>
  )
}
