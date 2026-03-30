import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeIcon } from './CustomNode'
import { getTechSuggestions } from '../lib/techSuggestions'
import type { DiagramSchema } from '../lib/types'

interface NodeDetailPanelProps {
  nodeId: string | null
  diagram: DiagramSchema
  onClose: () => void
}

export function NodeDetailPanel({ nodeId, diagram, onClose }: NodeDetailPanelProps) {
  const node = nodeId ? diagram.nodes.find((n) => n.id === nodeId) : null

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const connectedNodes = node
    ? diagram.edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const otherId = e.source === node.id ? e.target : e.source
          const other = diagram.nodes.find((n) => n.id === otherId)
          const direction = e.source === node.id ? 'out' : 'in'
          return other ? { node: other, direction, label: e.label } : null
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
            style={{ background: '#16162a', borderLeft: `1px solid ${node.color}30` }}
          >
            {/* Header */}
            <div
              className="px-4 pt-4 pb-3 border-b"
              style={{ borderColor: `${node.color}20` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <NodeIcon label={node.label} color={node.color} />
                  <span className="text-sm font-semibold" style={{ color: node.color }}>
                    {node.label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <span
                className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border font-medium"
                style={{ color: node.color, borderColor: `${node.color}40`, background: `${node.color}12` }}
              >
                {node.type}
              </span>
            </div>

            {/* Description */}
            <div className="px-4 py-3 border-b" style={{ borderColor: '#ffffff08' }}>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">Description</p>
              <p className="text-xs text-gray-300 leading-relaxed">{node.description}</p>
            </div>

            {/* Tech suggestions */}
            <div className="px-4 py-3 border-b" style={{ borderColor: '#ffffff08' }}>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2">Tech Options</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-md text-gray-300 border border-white/8 bg-white/4"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Connections */}
            {connectedNodes.length > 0 && (
              <div className="px-4 py-3">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2">Connections</p>
                <div className="flex flex-col gap-1.5">
                  {connectedNodes.map((conn, i) => {
                    if (!conn) return null
                    const { node: other, direction, label } = conn
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-gray-600">{direction === 'out' ? '→' : '←'}</span>
                        <span style={{ color: other.color }} className="font-medium">{other.label}</span>
                        {label && <span className="text-gray-600 text-[10px]">({label})</span>}
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
