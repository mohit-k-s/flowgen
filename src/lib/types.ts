export type NodeType = 'input' | 'default' | 'output'
export type EdgeStyle = 'solid' | 'dashed'

export interface NodeDef {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  color: string
  description: string
}

export interface EdgeDef {
  id: string
  source: string
  target: string
  label?: string
  animated: boolean
  style: EdgeStyle
}

export interface DiagramSchema {
  title: string
  nodes: NodeDef[]
  edges: EdgeDef[]
}

export type GenerationStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
