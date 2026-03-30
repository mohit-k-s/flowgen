import { toPng } from 'html-to-image'

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
