import type {
  DiagramSchema,
  EdgeDef,
  EdgeKind,
  NodeCategory,
  NodeDef,
  NodeImportance,
  NodeLane,
  NodeShape,
} from './types'

export interface NormalizedNodeDef extends NodeDef {
  category: NodeCategory
  lane: NodeLane
  importance: NodeImportance
  shape: NodeShape
}

export interface NormalizedEdgeDef extends EdgeDef {
  kind: EdgeKind
  importance: NodeImportance
}

export interface NormalizedDiagramSchema extends Omit<DiagramSchema, 'nodes' | 'edges'> {
  nodes: NormalizedNodeDef[]
  edges: NormalizedEdgeDef[]
}

function deriveNodeCategory(node: NodeDef): NodeCategory {
  if (node.category) return node.category

  const text = `${node.label} ${node.description}`.toLowerCase()

  if (/external|third.?party|vendor|partner/.test(text)) return 'external'
  if (/gateway|proxy|ingress|balancer|edge|waf|cdn/.test(text)) return 'gateway'
  if (/queue|kafka|broker|topic|event|stream|pubsub|webhook|sns|sqs|rabbit/.test(text)) return 'queue'
  if (/cache|redis|memcache|varnish/.test(text)) return 'cache'
  if (/database|db|postgres|mysql|mongo|dynamo|storage|warehouse|s3|blob|bucket|sql/.test(text)) return 'database'
  if (/worker|job|scheduler|cron|consumer|processor/.test(text)) return 'worker'
  if (/client|browser|frontend|mobile|user|app/.test(text) || node.type === 'input') return 'client'
  return 'service'
}

function deriveNodeLane(node: NodeDef, category: NodeCategory): NodeLane {
  if (node.lane) return node.lane

  switch (category) {
    case 'client':
    case 'external':
      return 'entry'
    case 'gateway':
      return 'edge'
    case 'queue':
      return 'async'
    case 'cache':
    case 'database':
      return 'data'
    case 'service':
    case 'worker':
    default:
      return 'app'
  }
}

function deriveNodeShape(node: NodeDef, category: NodeCategory): NodeShape {
  if (node.shape) return node.shape

  switch (category) {
    case 'client':
      return 'screen'
    case 'gateway':
      return 'shield'
    case 'queue':
      return 'queue'
    case 'cache':
      return 'pill'
    case 'database':
      return 'cylinder'
    case 'external':
      return 'external'
    case 'service':
    case 'worker':
    default:
      return 'service'
  }
}

function deriveNodeImportance(node: NodeDef): NodeImportance {
  if (node.importance) return node.importance
  const text = `${node.label} ${node.description}`.toLowerCase()
  return /primary|core|main|critical|gateway|api|service|database|auth/.test(text) ? 'primary' : 'secondary'
}

function deriveEdgeKind(edge: EdgeDef): EdgeKind {
  if (edge.kind) return edge.kind

  const text = `${edge.label ?? ''}`.toLowerCase()
  if (edge.async || edge.style === 'dashed' || /event|queue|publish|emit|notify|stream|async/.test(text)) return 'event'
  if (/auth|token|login|identity|jwt|oauth/.test(text)) return 'auth'
  if (/cache|hit|miss|invalidate/.test(text)) return 'cache'
  if (/read|write|query|persist|store|sync|replica/.test(text)) return 'data'
  return 'request'
}

function deriveEdgeImportance(edge: EdgeDef): NodeImportance {
  if (edge.importance) return edge.importance
  return edge.animated ? 'primary' : 'secondary'
}

export function normalizeNode(node: NodeDef): NormalizedNodeDef {
  const category = deriveNodeCategory(node)
  return {
    ...node,
    category,
    lane: deriveNodeLane(node, category),
    importance: deriveNodeImportance(node),
    shape: deriveNodeShape(node, category),
  }
}

export function normalizeDiagram(diagram: DiagramSchema): NormalizedDiagramSchema {
  return {
    ...diagram,
    nodes: diagram.nodes.map(normalizeNode),
    edges: diagram.edges.map((edge) => ({
      ...edge,
      kind: deriveEdgeKind(edge),
      importance: deriveEdgeImportance(edge),
    })),
  }
}

export function formatCategoryLabel(category: NodeCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export function formatLaneLabel(lane: NodeLane): string {
  switch (lane) {
    case 'entry':
      return 'Entry'
    case 'edge':
      return 'Edge'
    case 'app':
      return 'Application'
    case 'async':
      return 'Async'
    case 'data':
      return 'Data'
    default:
      return lane
  }
}
