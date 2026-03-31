import { toPng } from 'html-to-image'
import type { DiagramSchema } from './types'

export async function exportAsPng(title: string): Promise<void> {
  const el = document.querySelector<HTMLElement>('.react-flow__renderer')
  if (!el) return

  const dataUrl = await toPng(el, {
    backgroundColor: '#12121c',
    pixelRatio: 2,
  })

  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'diagram'}.png`
  a.click()
}

export function exportAsJson(diagram: DiagramSchema): void {
  const jsonString = JSON.stringify(diagram, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${diagram.title.replace(/\s+/g, '-').toLowerCase() || 'diagram'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
