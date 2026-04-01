import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { FlowCanvas } from './FlowCanvas'
import { NodeDetailPanel } from './NodeDetailPanel'
import { PromptHistory } from './PromptHistory'
import { WarningsPanel } from './WarningsPanel'
import type { DiagramSchema, GenerationStatus } from '../lib/types'
import { exportAsPng, exportAsJson } from '../lib/export'

interface DiagramPaneProps {
  diagram: DiagramSchema | null
  status: GenerationStatus
  error: string | null
  onReset: () => void
  onApplyFix: (fix: string) => void
  warningsEnabled: boolean
  onToggleWarnings: () => void
}

export function DiagramPane({ diagram, status, error, onReset, onApplyFix, warningsEnabled, onToggleWarnings }: DiagramPaneProps) {
  const [exporting, setExporting] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showWarnings, setShowWarnings] = useState(true)
  const canvasKey = diagram
    ? `${diagram.title}:${diagram.nodes.map((node) => `${node.id}:${node.x}:${node.y}:${node.label}`).join(',')}:${diagram.edges.map((edge) => `${edge.id}:${edge.source}:${edge.target}:${edge.label ?? ''}`).join(',')}`
    : 'empty'

  async function handleExport() {
    if (!diagram) return
    setExporting(true)
    try {
      await exportAsPng(diagram.title)
    } finally {
      setExporting(false)
    }
  }

  function handleExportJson() {
    if (!diagram) return
    exportAsJson(diagram)
  }

  // Clear selected node when diagram resets
  function handleReset() {
    setSelectedNodeId(null)
    onReset()
  }

  return (
    <div className="flex h-full flex-col bg-[#efe4d4]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#d9c8b3] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {diagram?.title ? (
            <span className="text-sm font-medium text-[#3a2f25]">{diagram.title}</span>
          ) : (
            <span className="text-sm text-[#8c7966]">Diagram Preview</span>
          )}
          {status === 'streaming' && (
            <span className="flex items-center gap-1.5 text-xs text-[#8d6c40]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b88846] animate-pulse" />
              Generating…
            </span>
          )}
          {status === 'done' && diagram && (
            <span className="text-xs text-[#5b7552]">
              {diagram.nodes.length} nodes · {diagram.edges.length} edges
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {diagram && (
            <span className="hidden items-center gap-1.5 rounded-full border border-[#d4c1aa] bg-white/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8f7862] md:inline-flex">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d1ab78]" />
              Drag Nodes
            </span>
          )}
          {status === 'done' && diagram && (
            <>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-[#765f4c] transition-colors hover:bg-white/70 hover:text-[#382c22] disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {exporting ? 'Exporting…' : 'Export PNG'}
              </button>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-[#765f4c] transition-colors hover:bg-white/70 hover:text-[#382c22]"
                title="Start building!"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
                Export JSON
              </button>
              {diagram.promptHistory && diagram.promptHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-[#765f4c] transition-colors hover:bg-white/70 hover:text-[#382c22]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  History ({diagram.promptHistory.length})
                </button>
              )}
              {diagram.warnings && diagram.warnings.length > 0 && (
                <button
                  onClick={() => setShowWarnings(!showWarnings)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${showWarnings
                    ? 'bg-[#efd4a3] text-[#8d5c16] hover:bg-[#e8c993]'
                    : 'text-[#765f4c] hover:bg-white/70 hover:text-[#382c22]'
                    }`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Warnings ({diagram.warnings.length})
                </button>
              )}
            </>
          )}
          {diagram && (
            <>
              <button
                onClick={onToggleWarnings}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${warningsEnabled
                    ? 'text-[#4d7a54] hover:text-[#35563c]'
                    : 'text-[#9c8a76] hover:text-[#7a6652]'
                  }`}
                title={warningsEnabled ? 'Disable architecture feedback' : 'Enable architecture feedback'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {warningsEnabled ? 'Feedback On' : 'Feedback Off'}
              </button>
              <button
                onClick={handleReset}
                className="rounded-md px-3 py-1.5 text-xs text-[#8d7762] transition-colors hover:bg-white/70 hover:text-[#3b2f25]"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        {error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center px-6">
              <div className="mb-1 text-sm font-medium text-[#b44f45]">Generation failed</div>
              <div className="max-w-xs text-xs text-[#8f7b66]">{error}</div>
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
            <FlowCanvas
              key={canvasKey}
              diagram={diagram}
              onNodeSelect={setSelectedNodeId}
            />
            {diagram && (
              <>
                <NodeDetailPanel
                  nodeId={selectedNodeId}
                  diagram={diagram}
                  onClose={() => setSelectedNodeId(null)}
                />
                {showHistory && diagram.promptHistory && (
                  <PromptHistory
                    history={diagram.promptHistory}
                    onClose={() => setShowHistory(false)}
                  />
                )}
              </>
            )}
          </ReactFlowProvider>
        )}
        {diagram && showWarnings && diagram.warnings && diagram.warnings.length > 0 && (
          <WarningsPanel
            warnings={diagram.warnings}
            onClose={() => setShowWarnings(false)}
            onApplyFix={onApplyFix}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center border-t border-[#d9c8b3] bg-[#e8dbc8] py-2">
        <span className="text-[10px] font-medium tracking-[0.3em] text-[#8c775f]">FlowGen</span>
      </div>
    </div>
  )
}
