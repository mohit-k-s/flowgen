import { useState, useCallback, useRef } from 'react'
import { streamDiagram } from '../lib/bedrock'
import type { DiagramSchema, GenerationStatus, Message } from '../lib/types'
import { parse } from 'partial-json'
import { applyDagreLayout } from '../lib/layout'

export function useDiagramGeneration() {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [diagram, setDiagram] = useState<DiagramSchema | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [warningsEnabled, setWarningsEnabled] = useState(true)
  const rawRef = useRef('')

  const generate = useCallback((prompt: string) => {
    rawRef.current = ''
    setStatus('streaming')
    setError(null)

    const history: Message[] = [
      ...messages,
      { role: 'user', content: prompt },
    ]

    const isRefinement = messages.length > 0

    streamDiagram(
      prompt,
      history,
      (chunk: string) => {
        rawRef.current += chunk
        try {
          const partial = parse(rawRef.current)
          if (partial && typeof partial === 'object' && 'nodes' in partial) {
            setDiagram(applyDagreLayout(partial as DiagramSchema))
          }
        } catch {
          // Not yet parseable — keep accumulating
        }
      },
      () => {
        try {
          const final = JSON.parse(rawRef.current) as DiagramSchema

          const newHistoryEntry = {
            timestamp: Date.now(),
            prompt,
            type: isRefinement ? 'refinement' as const : 'initial' as const
          }

          const existingHistory = diagram?.promptHistory || []
          const updatedDiagram = {
            ...final,
            promptHistory: [...existingHistory, newHistoryEntry]
          }

          const laid = applyDagreLayout(updatedDiagram)
          setDiagram(laid)
          setStatus('done')
          setMessages([
            ...history,
            { role: 'assistant', content: rawRef.current },
          ])
        } catch {
          setError('Failed to parse diagram JSON from response.')
          setStatus('error')
        }
      },
      (err: Error) => {
        setError(err.message)
        setStatus('error')
      },
      warningsEnabled,
    )
  }, [messages, diagram, warningsEnabled])

  const loadDiagram = useCallback((d: DiagramSchema, prompt?: string) => {
    const laid = applyDagreLayout(d)
    setDiagram(laid)
    setStatus('done')
    const diagramJson = JSON.stringify(d, null, 2)
    rawRef.current = diagramJson
    if (prompt) {
      setMessages([
        { role: 'user', content: prompt },
        { role: 'assistant', content: diagramJson },
      ])
    } else {
      setMessages([])
    }
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setDiagram(null)
    setStatus('idle')
    setError(null)
    setMessages([])
    rawRef.current = ''
  }, [])

  const toggleWarnings = useCallback(() => {
    setWarningsEnabled(prev => !prev)
  }, [])

  return { generate, reset, loadDiagram, status, diagram, error, messages, warningsEnabled, toggleWarnings }
}
