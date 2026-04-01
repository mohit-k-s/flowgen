import ReactFlow, {
  applyNodeChanges,
  Background,
  type NodeChange,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { CustomNode } from './CustomNode'
import type { DiagramSchema } from '../lib/types'
import { useStaggeredReveal } from '../hooks/useStaggeredReveal'
import { normalizeDiagram } from '../lib/presentation'
import { useCallback, useMemo, useState } from 'react'

const nodeTypes = { custom: CustomNode }

interface FlowCanvasProps {
  diagram: DiagramSchema | null
  onNodeSelect: (id: string) => void
}

export function FlowCanvas({ diagram, onNodeSelect }: FlowCanvasProps) {
  const normalizedDiagram = useMemo(() => (diagram ? normalizeDiagram(diagram) : null), [diagram])

  const allNodes = useMemo<Node[]>(() => {
    if (!normalizedDiagram?.nodes) return []
    return normalizedDiagram.nodes.map((n, i) => ({
      id: n.id,
      type: 'custom',
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        color: n.color || '#4F46E5',
        description: n.description,
        animIndex: i,
        category: n.category,
        lane: n.lane,
        importance: n.importance,
        shape: n.shape,
      },
    }))
  }, [normalizedDiagram])

  const revealedNodes = useStaggeredReveal(allNodes, 130)
  const [dragNodes, setDragNodes] = useState<Node[] | null>(null)

  const edges = useMemo<Edge[]>(() => {
    if (!normalizedDiagram?.edges || !normalizedDiagram?.nodes) return []

    const colorMap = new Map(normalizedDiagram.nodes.map((n) => [n.id, n.color || '#4F46E5']))
    const edgeStroke = {
      request: '#8e7a64',
      event: '#d28b2d',
      data: '#2c8c81',
      auth: '#cb5847',
      cache: '#4b8a52',
    } as const
    const edgeLabel = {
      request: '#6d5b4d',
      event: '#ba7a1f',
      data: '#266b63',
      auth: '#ad4234',
      cache: '#46764b',
    } as const

    return normalizedDiagram.edges.map((e) => {
      const sourceColor = colorMap.get(e.source) ?? '#8e7a64'
      const color = edgeStroke[e.kind] ?? sourceColor
      const isDashed = e.kind === 'event' || e.style === 'dashed' || e.async === true
      const label = e.label ?? (e.kind === 'event' ? 'async' : undefined)

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label,
        animated: e.animated,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: e.importance === 'primary' ? 20 : 16,
          height: e.importance === 'primary' ? 20 : 16,
        },
        style: {
          stroke: color,
          strokeWidth: e.importance === 'primary' ? 2.4 : 1.7,
          strokeDasharray: isDashed ? '7,5' : undefined,
          opacity: e.importance === 'primary' ? 0.92 : 0.72,
        },
        labelStyle: {
          fill: edgeLabel[e.kind],
          fontSize: 10,
          fontWeight: e.importance === 'primary' ? 700 : 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
        labelBgStyle: { fill: '#fbf6ef', fillOpacity: 0.96, stroke: `${color}25`, strokeWidth: 1 },
        labelBgPadding: [7, 4] as [number, number],
        labelBgBorderRadius: 999,
      }
    })
  }, [normalizedDiagram])

  const nodes = dragNodes ?? revealedNodes

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setDragNodes((current) => applyNodeChanges(changes, current ?? revealedNodes))
  }, [revealedNodes])

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onNodeSelect(node.id)
  }

  if (!diagram) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-[#8d7a66]">
        <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 64 64">
          <rect x="4" y="4" width="56" height="56" rx="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="44" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="44" r="6" stroke="currentColor" strokeWidth="2" />
          <line x1="26" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="22" y1="25" x2="30" y2="38" stroke="currentColor" strokeWidth="2" />
          <line x1="42" y1="25" x2="34" y2="38" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="text-xs uppercase tracking-[0.28em]">Describe Your Architecture And Click Generate</p>
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable
      onNodesChange={handleNodesChange}
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      className="flow-canvas editorial-flow"
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={18}
        size={1.1}
        color="#d7c8b1"
      />
      <Controls className="!bottom-4 !right-4 !left-auto !top-auto" />
      <MiniMap
        nodeColor={(node) => node.data?.color || '#4F46E5'}
        className="!bottom-4 !right-20"
        maskColor="rgba(237, 227, 211, 0.72)"
      />
    </ReactFlow>
  )
}
