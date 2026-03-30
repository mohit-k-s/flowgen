import { useState, useEffect } from 'react'

export function useStaggeredReveal<T>(items: T[], delayMs = 120): T[] {
  const [revealed, setRevealed] = useState<T[]>([])

  useEffect(() => {
    setRevealed([])
    if (!items.length) return

    const timers: ReturnType<typeof setTimeout>[] = []
    items.forEach((item, i) => {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => [...prev, item])
        }, i * delayMs),
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [items, delayMs])

  return revealed
}
