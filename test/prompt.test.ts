import { describe, expect, it } from 'vitest'
import { SYSTEM_PROMPT, getSystemPrompt } from '../src/lib/prompt'

describe('getSystemPrompt', () => {
  it('returns the full prompt when warnings are enabled', () => {
    expect(getSystemPrompt(true)).toBe(SYSTEM_PROMPT)
    expect(getSystemPrompt(true)).toContain('"warnings": [')
    expect(getSystemPrompt(true)).toContain('Warnings (IMPORTANT - analyze the architecture and provide feedback):')
  })

  it('removes the warnings schema and instructions cleanly when warnings are disabled', () => {
    const prompt = getSystemPrompt(false)

    expect(prompt).not.toContain('"warnings": [')
    expect(prompt).not.toContain('Warnings (IMPORTANT - analyze the architecture and provide feedback):')
    expect(prompt).not.toContain('relatedNodes')
    expect(prompt).not.toContain('relatedEdges')
    expect(prompt).toContain('"edges": [')
    expect(prompt).toContain('Rules:')
    expect(prompt).toContain('Output ONLY the JSON. No other text.')
  })
})
