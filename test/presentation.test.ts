import { describe, expect, it } from 'vitest'
import { formatCategoryLabel, formatLaneLabel, normalizeDiagram, normalizeNode } from '../src/lib/presentation'
import type { DiagramSchema, NodeDef } from '../src/lib/types'

describe('presentation normalization', () => {
  it('derives stable semantic metadata for legacy nodes', () => {
    const legacyNode: NodeDef = {
      id: 'postgres',
      label: 'PostgreSQL',
      type: 'output',
      x: 0,
      y: 0,
      color: '#059669',
      description: 'Shared relational database for persistent storage',
    }

    const normalized = normalizeNode(legacyNode)

    expect(normalized.category).toBe('database')
    expect(normalized.lane).toBe('data')
    expect(normalized.shape).toBe('cylinder')
    expect(normalized.importance).toBe('primary')
  })

  it('preserves explicit semantic metadata when present', () => {
    const diagram: DiagramSchema = {
      title: 'Semantic Diagram',
      nodes: [
        {
          id: 'partner',
          label: 'Vendor API',
          type: 'input',
          x: 0,
          y: 0,
          color: '#0EA5E9',
          description: 'External provider',
          category: 'external',
          lane: 'entry',
          importance: 'secondary',
          shape: 'external',
        },
      ],
      edges: [
        {
          id: 'partner-auth',
          source: 'partner',
          target: 'partner',
          label: 'oauth token',
          animated: false,
          style: 'solid',
          kind: 'auth',
          importance: 'secondary',
        },
      ],
    }

    const normalized = normalizeDiagram(diagram)

    expect(normalized.nodes[0]?.category).toBe('external')
    expect(normalized.nodes[0]?.shape).toBe('external')
    expect(normalized.edges[0]?.kind).toBe('auth')
    expect(normalized.edges[0]?.importance).toBe('secondary')
  })

  it('formats category and lane labels for display', () => {
    expect(formatCategoryLabel('gateway')).toBe('Gateway')
    expect(formatLaneLabel('app')).toBe('Application')
  })
})
