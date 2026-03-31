import type { ArchitectureWarning } from '../lib/types'

interface WarningsPanelProps {
  warnings: ArchitectureWarning[]
  onClose: () => void
  onApplyFix: (fix: string) => void
}

export function WarningsPanel({ warnings, onClose, onApplyFix }: WarningsPanelProps) {
  if (warnings.length === 0) return null

  const getSeverityColor = (severity: ArchitectureWarning['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getSeverityIcon = (severity: ArchitectureWarning['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
    }
  }

  const criticalCount = warnings.filter(w => w.severity === 'critical').length
  const warningCount = warnings.filter(w => w.severity === 'warning').length
  const infoCount = warnings.filter(w => w.severity === 'info').length

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#0f0f1a] border-t border-white/10 z-10 max-h-[40%] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">Architecture Feedback</h3>
          <div className="flex items-center gap-2 text-xs">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">
                {warningCount} Warning
              </span>
            )}
            {infoCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                {infoCount} Info
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Warnings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className={`flex gap-3 p-3 rounded-lg border ${getSeverityColor(warning.severity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getSeverityIcon(warning.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed">
                {warning.message}
              </p>
              {(warning.relatedNodes?.length || warning.relatedEdges?.length) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {warning.relatedNodes?.map((nodeId) => (
                    <span
                      key={nodeId}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono"
                    >
                      {nodeId}
                    </span>
                  ))}
                  {warning.relatedEdges?.map((edgeId) => (
                    <span
                      key={edgeId}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono"
                    >
                      {edgeId}
                    </span>
                  ))}
                </div>
              )}
              {warning.suggestedFix && (
                <button
                  onClick={() => onApplyFix(warning.suggestedFix!)}
                  className="mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Apply Fix
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
