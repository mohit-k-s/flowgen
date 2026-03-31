import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamDiagram } from '../src/lib/bedrock'
import type { Message } from '../src/lib/types'

function createStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line))
      }
      controller.close()
    },
  })
}

describe('streamDiagram', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the prompt payload and streams text chunks until done', async () => {
    const onChunk = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()
    const history: Message[] = [{ role: 'user', content: 'Existing diagram context' }]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      body: createStream([
        'data: {"text":"{\\"title\\":\\"Demo\\""}\n\n',
        'data: {"text":",\\"nodes\\":[],\\"edges\\":[]}"}\n\n',
        'data: [DONE]\n\n',
      ]),
    })

    vi.stubGlobal('fetch', fetchMock)

    await streamDiagram('Create a demo flow', history, onChunk, onDone, onError, false)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Create a demo flow',
          history,
          warningsEnabled: false,
        }),
      }),
    )
    expect(onChunk).toHaveBeenNthCalledWith(1, '{"title":"Demo"')
    expect(onChunk).toHaveBeenNthCalledWith(2, ',"nodes":[],"edges":[]}')
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
  })

  it('surfaces server-side SSE errors without calling onDone', async () => {
    const onChunk = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        body: createStream(['data: {"error":"Bedrock unavailable"}\n\n']),
      }),
    )

    await streamDiagram('Create a demo flow', [], onChunk, onDone, onError)

    expect(onChunk).not.toHaveBeenCalled()
    expect(onDone).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error)
    expect(onError.mock.calls[0]?.[0].message).toBe('Bedrock unavailable')
  })
})
