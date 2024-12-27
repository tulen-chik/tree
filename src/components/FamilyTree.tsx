import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection // Import Connection type
} from 'react-flow-renderer'
import { RootState } from '../store'
import { getLayoutedElements } from '../utils/treeLayout'

interface FamilyTreeProps {
  onNodeClick: (memberId: string) => void
}

export default function FamilyTree({ onNodeClick }: FamilyTreeProps) {
  const familyMembers = useSelector((state: RootState) => state.familyMembers.familyMembers)

  const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(familyMembers)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(familyMembers)
    setNodes(newNodes)
    setEdges(newEdges)
  }, [familyMembers, setNodes, setEdges])

  return (
      <div style={{ width: '100%', height: '600px' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => onNodeClick(node.id)}
            fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
  )
}