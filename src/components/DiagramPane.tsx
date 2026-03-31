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
                disabled={exporting}
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
                onClick={handleExportJson}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
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
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-gray-500 hover:text-gray-400'
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
                className="text-xs px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
      <div className="flex items-center justify-center py-2 border-t border-white/5 bg-[#0a0a12]">
        <span className="text-[10px] font-medium text-gray-500 tracking-widest">FlowGen</span>
      </div>
    </div>
  )
}
