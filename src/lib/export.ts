import { toPng } from 'html-to-image'
import GIF from 'gif.js'

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

export async function exportAsGif(
  title: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const el = document.querySelector<HTMLElement>('.react-flow__renderer')
  if (!el) return

  const nodes = document.querySelectorAll<HTMLElement>('.react-flow__node')
  if (nodes.length === 0) return

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: el.offsetWidth,
    height: el.offsetHeight,
    workerScript: '/gif.worker.js',
  })

  const originalVisibility = Array.from(nodes).map((node) => node.style.opacity)

  try {
    Array.from(nodes).forEach((node) => {
      node.style.opacity = '0'
    })

    for (let i = 0; i <= nodes.length; i++) {
      for (let j = 0; j < i; j++) {
        nodes[j].style.opacity = originalVisibility[j] || '1'
      }

      const canvas = document.createElement('canvas')
      canvas.width = el.offsetWidth
      canvas.height = el.offsetHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) continue

      const dataUrl = await toPng(el, {
        backgroundColor: '#12121c',
        pixelRatio: 1,
      })

      await new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          gif.addFrame(ctx, { copy: true, delay: i === nodes.length ? 1000 : 500 })
          resolve()
        }
        img.src = dataUrl
      })
    }

    Array.from(nodes).forEach((node, i) => {
      node.style.opacity = originalVisibility[i]
    })
  } catch (error) {
    Array.from(nodes).forEach((node, i) => {
      node.style.opacity = originalVisibility[i]
    })
    throw error
  }

  gif.on('progress', (p) => {
    onProgress?.(p)
  })

  gif.on('finished', (blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'diagram'}.gif`
    a.click()
    URL.revokeObjectURL(url)
  })

  gif.render()
}
