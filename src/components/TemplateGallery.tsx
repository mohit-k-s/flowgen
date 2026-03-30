import { TEMPLATES, type Template } from '../lib/templates'
import type { DiagramSchema } from '../lib/types'

interface TemplateGalleryProps {
  onLoad: (diagram: DiagramSchema, prompt: string) => void
}

function MiniPreview({ diagram }: { diagram: DiagramSchema }) {
  const colors = [...new Set(diagram.nodes.map((n) => n.color))].slice(0, 6)
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {colors.map((color, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: color, opacity: 0.85 }}
        />
      ))}
      <span className="text-gray-600 text-[10px] ml-1 self-center">
        {diagram.nodes.length} nodes
      </span>
    </div>
  )
}

export function TemplateGallery({ onLoad }: TemplateGalleryProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
        Templates
      </p>
      <div className="flex flex-col gap-2">
        {TEMPLATES.map((t: Template) => (
          <button
            key={t.id}
            onClick={() => onLoad(t.diagram, t.prompt)}
            className="text-left w-full rounded-lg px-3 py-2.5 border border-white/8 bg-white/3 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">
                {t.name}
              </span>
              <span className="text-[10px] text-gray-600 group-hover:text-indigo-400 transition-colors">
                Load →
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{t.description}</p>
            <MiniPreview diagram={t.diagram} />
          </button>
        ))}
      </div>
    </div>
  )
}
