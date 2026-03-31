import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { FlowCanvas } from './FlowCanvas'
import { NodeDetailPanel } from './NodeDetailPanel'
import type { DiagramSchema, GenerationStatus } from '../lib/types'
import { exportAsPng, exportAsGif } from '../lib/export'

interface DiagramPaneProps {
  diagram: DiagramSchema | null
  status: GenerationStatus
  error: string | null
  onReset: () => void
}

export function DiagramPane({ diagram, status, error, onReset }: DiagramPaneProps) {
  const [exporting, setExporting] = useState(false)
  const [exportingGif, setExportingGif] = useState(false)
  const [gifProgress, setGifProgress] = useState(0)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  async function handleExport() {
    if (!diagram) return
    setExporting(true)
    try {
      await exportAsPng(diagram.title)
    } finally {
      setExporting(false)
    }
  }

  async function handleExportGif() {
    if (!diagram) return
    setExportingGif(true)
    setGifProgress(0)
    try {
      await exportAsGif(diagram.title, (progress) => {
        setGifProgress(Math.round(progress * 100))
      })
    } finally {
      setExportingGif(false)
      setGifProgress(0)
    }
  }

  // Clear selected node when diagram resets
  function handleReset() {
    setSelectedNodeId(null)
    onReset()
  }

  return (
    <div className="flex flex-col h-full bg-[#12121c]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          {diagram?.title ? (
            <span className="text-sm font-medium text-gray-200">{diagram.title}</span>
          ) : (
            <span className="text-sm text-gray-500">Diagram Preview</span>
          )}
          {status === 'streaming' && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Generating…
            </span>
          )}
          {status === 'done' && diagram && (
            <span className="text-xs text-emerald-400">
              {diagram.nodes.length} nodes · {diagram.edges.length} edges
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === 'done' && diagram && (
            <>
              <button
                onClick={handleExport}
                disabled={exporting || exportingGif}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {exporting ? 'Exporting…' : 'Export PNG'}
              </button>
              <button
                onClick={handleExportGif}
                disabled={exporting || exportingGif}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {exportingGif ? `Exporting… ${gifProgress}%` : 'Export GIF'}
              </button>
            </>
          )}
          {diagram && (
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6">
              <div className="text-red-400 text-sm font-medium mb-1">Generation failed</div>
              <div className="text-gray-500 text-xs max-w-xs">{error}</div>
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
            <FlowCanvas
              diagram={diagram}
              onNodeSelect={setSelectedNodeId}
            />
            {diagram && (
              <NodeDetailPanel
                nodeId={selectedNodeId}
                diagram={diagram}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </ReactFlowProvider>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center py-2 border-t border-white/5 bg-[#0a0a12]">
        <span className="text-[10px] font-semibold text-indigo-400 tracking-wider">ICS</span>
        <span className="text-[10px] font-medium text-gray-600 mx-1.5">·</span>
        <span className="text-[9px] font-medium text-gray-500 tracking-widest uppercase">SkunkWorks</span>
      </div>
    </div>
  )
}
