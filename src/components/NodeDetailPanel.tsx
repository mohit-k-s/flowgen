import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeIcon } from './CustomNode'
import { getTechSuggestions } from '../lib/techSuggestions'
import type { DiagramSchema } from '../lib/types'
import { formatCategoryLabel, formatLaneLabel, normalizeDiagram } from '../lib/presentation'

interface NodeDetailPanelProps {
  nodeId: string | null
  diagram: DiagramSchema
  onClose: () => void
}

export function NodeDetailPanel({ nodeId, diagram, onClose }: NodeDetailPanelProps) {
  const normalizedDiagram = normalizeDiagram(diagram)
  const node = nodeId ? normalizedDiagram.nodes.find((n) => n.id === nodeId) : null

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const connectedNodes = node
    ? normalizedDiagram.edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const otherId = e.source === node.id ? e.target : e.source
          const other = normalizedDiagram.nodes.find((n) => n.id === otherId)
          const direction = e.source === node.id ? 'out' : 'in'
          return other ? { node: other, direction, label: e.label, kind: e.kind } : null
        })
        .filter(Boolean)
    : []

  const suggestions = node ? getTechSuggestions(node.label, node.color) : []

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="absolute top-0 right-0 h-full w-72 z-40 flex flex-col overflow-y-auto"
            style={{ background: '#f8f3ec', borderLeft: `1px solid ${node.color}30` }}
          >
            {/* Header */}
            <div
              className="px-4 pt-4 pb-3 border-b"
              style={{ borderColor: `${node.color}20` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <NodeIcon label={node.label} color={node.color} category={node.category} shape={node.shape} />
                  <span className="text-sm font-semibold" style={{ color: '#241c13' }}>
                    {node.label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="mt-0.5 flex-shrink-0 text-[#8a7762] transition-colors hover:text-[#5e4d3d]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span
                  className="inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-[0.16em]"
                  style={{ color: node.color, borderColor: `${node.color}40`, background: `${node.color}12` }}
                >
                  {formatCategoryLabel(node.category)}
                </span>
                <span className="inline-block rounded-full border border-[#cdbca7] bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#826f5e]">
                  {formatLaneLabel(node.lane)}
                </span>
                <span className="inline-block rounded-full border border-[#ddcfba] bg-[#fbf7f0] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#9a856f]">
                  {node.importance}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 py-3 border-b" style={{ borderColor: '#ffffff08' }}>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8a7763]">Description</p>
              <p className="text-xs leading-relaxed text-[#6f5f50]">{node.description}</p>
            </div>

            {/* Tech suggestions */}
            <div className="px-4 py-3 border-b" style={{ borderColor: '#ffffff08' }}>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[#8a7763]">Tech Options</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-[#dacbb8] bg-white/70 px-2 py-0.5 text-[11px] text-[#655647]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Connections */}
            {connectedNodes.length > 0 && (
              <div className="px-4 py-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[#8a7763]">Connections</p>
                <div className="flex flex-col gap-1.5">
                  {connectedNodes.map((conn, i) => {
                    if (!conn) return null
                    const { node: other, direction, label, kind } = conn
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#7a6856]">
                        <span className="text-[#b09a84]">{direction === 'out' ? '→' : '←'}</span>
                        <span style={{ color: other.color }} className="font-medium">{other.label}</span>
                        {kind && <span className="text-[10px] uppercase tracking-[0.14em] text-[#ad977f]">{kind}</span>}
                        {label && <span className="text-[10px] text-[#99836d]">({label})</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
