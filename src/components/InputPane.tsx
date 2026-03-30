import { useState, useRef, useEffect } from 'react'
import { TemplateGallery } from './TemplateGallery'
import type { DiagramSchema, GenerationStatus } from '../lib/types'

interface InputPaneProps {
  onGenerate: (prompt: string) => void
  onLoadTemplate: (diagram: DiagramSchema, prompt: string) => void
  status: GenerationStatus
  hasExistingDiagram: boolean
}

export function InputPane({ onGenerate, onLoadTemplate, status, hasExistingDiagram }: InputPaneProps) {
  const [prompt, setPrompt] = useState('')
  const [refinePrompt, setRefinePrompt] = useState('')
  const isLoading = status === 'streaming'
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const refineTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [prompt])

  // Auto-resize refine textarea to fit content
  useEffect(() => {
    const el = refineTextareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [refinePrompt])

  const handleSubmit = () => {
    const trimmed = prompt.trim()
    if (!trimmed || isLoading) return
    onGenerate(trimmed)
  }

  const handleRefine = () => {
    const trimmed = refinePrompt.trim()
    if (!trimmed || isLoading) return
    onGenerate(trimmed)
    setRefinePrompt('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (hasExistingDiagram) handleRefine()
      else handleSubmit()
    }
  }

  function handleTemplateLoad(diagram: DiagramSchema, templatePrompt: string) {
    setPrompt(templatePrompt)
    onLoadTemplate(diagram, templatePrompt)
  }

  return (
    <div className="flex flex-col h-full p-5 gap-5 bg-[#0f0f1a] border-r border-white/5 overflow-y-auto">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Flow Diagram Generator
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Describe any architecture or process
        </p>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Your Requirements
        </label>
        <textarea
          ref={textareaRef}
          className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 border border-white/8 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-[border,box-shadow] leading-relaxed min-h-[120px] overflow-hidden"
          placeholder="e.g. Design a microservices architecture with an API gateway, auth service, and three downstream services connected to a shared PostgreSQL database..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <p className="text-xs text-gray-600 text-right">⌘↵ to generate</p>
      </div>

      {/* Generate button */}
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all
          bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
          flex items-center justify-center gap-2"
      >
        {isLoading && !hasExistingDiagram ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <span>Generate Diagram</span>
            <span className="text-indigo-300">▶</span>
          </>
        )}
      </button>

      {/* Refine section — only shown after a diagram exists */}
      {hasExistingDiagram && (
        <div className="flex flex-col gap-2">
          <div className="border-t border-white/5" />
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Refine Diagram
          </label>
          <div className="flex gap-2 items-end">
            <textarea
              ref={refineTextareaRef}
              className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 border border-white/8 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none overflow-hidden min-h-[38px]"
              placeholder='e.g. "Add a Redis cache between API and DB"'
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              onClick={handleRefine}
              disabled={!refinePrompt.trim() || isLoading}
              className="px-3 py-2 rounded-lg bg-emerald-600/80 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 flex-shrink-0"
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                '↵'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Templates */}
      <TemplateGallery onLoad={handleTemplateLoad} />
    </div>
  )
}
