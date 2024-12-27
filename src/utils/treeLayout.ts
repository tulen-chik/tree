import dagre from 'dagre'
import { Node, Edge } from 'react-flow-renderer'
import { FamilyMember } from '@/types/family'

const nodeWidth = 172
const nodeHeight = 36

export function getLayoutedElements(members: FamilyMember[]): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', ranksep: 70, nodesep: 50 })

  // First, add all nodes to the graph
  members.forEach((member) => {
    nodes.push({
      id: member.id,
      data: { label: member.name },
      position: { x: 0, y: 0 },
    })
    graph.setNode(member.id, { width: nodeWidth, height: nodeHeight })
  })

  // Then, add all edges
  members.forEach((member) => {
    if (member.parent_id) {
      edges.push({
        id: `${member.parent_id}-${member.id}`,
        source: member.parent_id,
        target: member.id,
      })
      graph.setEdge(member.parent_id, member.id)
    }

    if (member.partner_id) {
      const partnerId = member.partner_id
      if (!edges.some(e => 
        (e.source === member.id && e.target === partnerId) || 
        (e.source === partnerId && e.target === member.id)
      )) {
        edges.push({
          id: `${member.id}-${partnerId}`,
          source: member.id,
          target: partnerId,
          type: 'straight',
          style: { stroke: '#FF69B4' },
        })
        graph.setEdge(member.id, partnerId, { minlen: 1 })
      }
    }
  })

  dagre.layout(graph)

  nodes.forEach((node) => {
    const nodeWithPosition = graph.node(node.id)
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }
  })

  return { nodes, edges }
}

