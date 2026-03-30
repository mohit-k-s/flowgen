import ReactFlow, {
  Background,
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
import { useMemo } from 'react'

const nodeTypes = { custom: CustomNode }

interface FlowCanvasProps {
  diagram: DiagramSchema | null
  onNodeSelect: (id: string) => void
}

export function FlowCanvas({ diagram, onNodeSelect }: FlowCanvasProps) {
  const allNodes = useMemo<Node[]>(() => {
    if (!diagram?.nodes) return []
    return diagram.nodes.map((n, i) => ({
      id: n.id,
      type: 'custom',
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        color: n.color || '#4F46E5',
        description: n.description,
        animIndex: i,
      },
    }))
  }, [diagram])

  const revealedNodes = useStaggeredReveal(allNodes, 130)

  const edges = useMemo<Edge[]>(() => {
    if (!diagram?.edges || !diagram?.nodes) return []

    const colorMap = new Map(diagram.nodes.map((n) => [n.id, n.color || '#4F46E5']))

    return diagram.edges.map((e) => {
      const color = colorMap.get(e.source) ?? '#6366f1'
      const isDashed = e.style === 'dashed'

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.animated,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color,
          width: 18,
          height: 18,
        },
        style: {
          stroke: color,
          strokeWidth: isDashed ? 1.5 : 2,
          strokeDasharray: isDashed ? '6,4' : undefined,
          opacity: 0.85,
        },
        labelStyle: { fill: '#cbd5e1', fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: '#12121c', fillOpacity: 0.9 },
        labelBgPadding: [5, 3] as [number, number],
        labelBgBorderRadius: 4,
      }
    })
  }, [diagram])

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onNodeSelect(node.id)
  }

  if (!diagram) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-3">
        <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 64 64">
          <rect x="4" y="4" width="56" height="56" rx="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="44" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="44" r="6" stroke="currentColor" strokeWidth="2" />
          <line x1="26" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="22" y1="25" x2="30" y2="38" stroke="currentColor" strokeWidth="2" />
          <line x1="42" y1="25" x2="34" y2="38" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="text-sm">Describe your architecture and click Generate</p>
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={revealedNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      className="flow-canvas"
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#2e2e3e"
      />
      <Controls className="!bottom-4 !right-4 !left-auto !top-auto" />
      <MiniMap
        nodeColor={(node) => node.data?.color || '#4F46E5'}
        className="!bottom-4 !right-20"
        maskColor="rgba(18,18,28,0.7)"
      />
    </ReactFlow>
  )
}
