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
  const rawRef = useRef('')

  const generate = useCallback((prompt: string) => {
    rawRef.current = ''
    setStatus('streaming')
    setError(null)

    const history: Message[] = [
      ...messages,
      { role: 'user', content: prompt },
    ]

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
          const laid = applyDagreLayout(final)
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
    )
  }, [messages])

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

  return { generate, reset, loadDiagram, status, diagram, error, messages }
}
