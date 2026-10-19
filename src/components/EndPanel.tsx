import { useState } from 'react'
import { formatCountdown } from '../lib/date'
import { buildShareText } from '../lib/share'
import type { Puzzle } from '../lib/puzzles'

interface Props {
  puzzle: Puzzle
  number: number
  guessCount: number
  won: boolean
  msUntilNext: number
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers, or a page served without a secure context
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function EndPanel({ puzzle, number, guessCount, won, msUntilNext }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2000)
  }

  async function share() {
    const text = buildShareText(number, guessCount, won, window.location.origin + import.meta.env.BASE_URL)
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }
    showToast((await copyText(text)) ? 'Copied!' : 'Couldn’t copy. Try again?')
  }

  return (
    <section className="end-panel" aria-labelledby="result-heading">
      <h2 id="result-heading">{won ? `You got it in ${guessCount}!` : `It was: ${puzzle.answer}`}</h2>
      {won && <p className="answer">{puzzle.answer}</p>}
      <p className="fun-fact">{puzzle.funFact}</p>
      <p className="credit">
        <a href={puzzle.creditUrl} target="_blank" rel="noopener noreferrer">
          {puzzle.credit}
        </a>
      </p>
      <button type="button" className="share-button" onClick={share}>
        Share
      </button>
      <p className="next">Next picture in {formatCountdown(msUntilNext)}</p>
      <div className="toast" role="status" aria-live="polite">
        {toast && <span>{toast}</span>}
      </div>
    </section>
  )
}
