import type { Message } from './types'

export async function streamDiagram(
  userPrompt: string,
  history: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  warningsEnabled: boolean = true,
): Promise<void> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, history, warningsEnabled }),
    })

    if (!response.ok || !response.body) {
      onError(new Error(`Request failed: ${response.status}`))
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') {
          onDone()
          return
        }
        const parsed = JSON.parse(payload) as { text?: string; error?: string }
        if (parsed.error) {
          onError(new Error(parsed.error))
          return
        }
        if (parsed.text) {
          onChunk(parsed.text)
        }
      }
    }

    onDone()
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}
