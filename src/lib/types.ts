export type NodeType = 'input' | 'default' | 'output'
export type EdgeStyle = 'solid' | 'dashed'
export type NodeCategory =
  | 'client'
  | 'gateway'
  | 'service'
  | 'worker'
  | 'queue'
  | 'cache'
  | 'database'
  | 'external'
export type NodeLane = 'entry' | 'edge' | 'app' | 'async' | 'data'
export type NodeImportance = 'primary' | 'secondary'
export type NodeShape = 'screen' | 'shield' | 'service' | 'queue' | 'cylinder' | 'pill' | 'external'
export type EdgeKind = 'request' | 'event' | 'data' | 'auth' | 'cache'

export interface NodeDef {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  color: string
  description: string
  category?: NodeCategory
  lane?: NodeLane
  importance?: NodeImportance
  shape?: NodeShape
}

export interface EdgeDef {
  id: string
  source: string
  target: string
  label?: string
  animated: boolean
  style: EdgeStyle
  async?: boolean
  kind?: EdgeKind
  importance?: NodeImportance
}

export interface DiagramSchema {
  title: string
  nodes: NodeDef[]
  edges: EdgeDef[]
  promptHistory?: PromptHistoryEntry[]
  warnings?: ArchitectureWarning[]
}

export interface ArchitectureWarning {
  severity: 'info' | 'warning' | 'critical'
  message: string
  relatedNodes?: string[]
  relatedEdges?: string[]
  suggestedFix?: string
}

export interface PromptHistoryEntry {
  timestamp: number
  prompt: string
  type: 'initial' | 'refinement'
}

export type GenerationStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
