import { describe, expect, it } from 'vitest'
import { applyDagreLayout } from '../src/lib/layout'
import type { DiagramSchema } from '../src/lib/types'

describe('applyDagreLayout', () => {
  it('returns the original object when there are no nodes', () => {
    const diagram: DiagramSchema = {
      title: 'Empty',
      nodes: [],
      edges: [],
    }

    expect(applyDagreLayout(diagram)).toBe(diagram)
  })

  it('assigns computed positions while preserving node and edge data', () => {
    const diagram: DiagramSchema = {
      title: 'Simple Flow',
      nodes: [
        {
          id: 'client',
          label: 'Client',
          type: 'input',
          x: 0,
          y: 0,
          color: '#0EA5E9',
          description: 'Caller',
        },
        {
          id: 'api',
          label: 'API',
          type: 'default',
          x: 0,
          y: 0,
          color: '#4F46E5',
          description: 'Service',
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'client',
          target: 'api',
          animated: true,
          style: 'solid',
        },
      ],
    }

    const laidOut = applyDagreLayout(diagram)

    expect(laidOut).not.toBe(diagram)
    expect(laidOut.edges).toEqual(diagram.edges)
    expect(laidOut.nodes).toHaveLength(2)
    expect(laidOut.nodes.map((node) => node.id)).toEqual(['client', 'api'])
    expect(laidOut.nodes.every((node) => Number.isFinite(node.x) && Number.isFinite(node.y))).toBe(true)
    expect(laidOut.nodes.some((node) => node.x !== 0 || node.y !== 0)).toBe(true)
    expect(laidOut.nodes[0]?.description).toBe('Caller')
    expect(laidOut.nodes[1]?.description).toBe('Service')
  })
})
