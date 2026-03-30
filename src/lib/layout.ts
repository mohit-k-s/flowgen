import dagre from 'dagre'
import type { DiagramSchema } from './types'

const NODE_WIDTH = 160
const NODE_HEIGHT = 80

export function applyDagreLayout(diagram: DiagramSchema): DiagramSchema {
  if (!diagram.nodes?.length) return diagram

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 100, marginx: 40, marginy: 40 })

  for (const node of diagram.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }

  for (const edge of diagram.edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  const nodes = diagram.nodes.map((node) => {
    const { x, y } = g.node(node.id)
    return { ...node, x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 }
  })

  return { ...diagram, nodes }
}
