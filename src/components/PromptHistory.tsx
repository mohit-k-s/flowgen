import type { PromptHistoryEntry } from '../lib/types'

interface PromptHistoryProps {
  history: PromptHistoryEntry[]
  onClose: () => void
}

export function PromptHistory({ history, onClose }: PromptHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-[#0f0f1a] border-l border-white/10 flex flex-col z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">Prompt History</h3>
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

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.map((entry, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                entry.type === 'initial' 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {entry.type === 'initial' ? 'Initial' : 'Refinement'}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {entry.prompt}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
