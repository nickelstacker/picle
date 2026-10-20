import { useEffect, useRef, useState, type PointerEvent } from 'react'

export type Key = string | 'space' | 'backspace' | 'enter'

interface Props {
  onKey: (key: Key) => void
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
const REPEAT_DELAY_MS = 400
const REPEAT_EVERY_MS = 70
// A tap fires on touch-down; ignore the click the browser sends afterwards for the same tap.
const CLICK_AFTER_POINTER_MS = 700

export function Keyboard({ onKey }: Props) {
  const [pressed, setPressed] = useState<Key | null>(null)
  const lastPointerAt = useRef(0)
  const repeat = useRef<{ delay?: number; every?: number }>({})

  function stopRepeat() {
    window.clearTimeout(repeat.current.delay)
    window.clearInterval(repeat.current.every)
  }

  useEffect(() => stopRepeat, [])

  function release() {
    setPressed(null)
    stopRepeat()
  }

  const keyProps = (key: Key) => ({
    type: 'button' as const,
    // Keys never take focus, so typing on a physical keyboard keeps working after a tap.
    tabIndex: -1,
    // Firing on touch-down, not on click, means a finger that slides slightly still types the letter.
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      e.preventDefault()
      lastPointerAt.current = Date.now()
      setPressed(key)
      onKey(key)
      if (key === 'backspace') {
        stopRepeat()
        repeat.current.delay = window.setTimeout(() => {
          repeat.current.every = window.setInterval(() => onKey('backspace'), REPEAT_EVERY_MS)
        }, REPEAT_DELAY_MS)
      }
    },
    onPointerUp: release,
    onPointerCancel: release,
    onPointerLeave: release,
    // Screen readers and other assistive tech activate keys with a plain click.
    onClick: () => {
      if (Date.now() - lastPointerAt.current > CLICK_AFTER_POINTER_MS) onKey(key)
    },
    'data-pressed': pressed === key || undefined,
  })

  const letterKey = (letter: string) => (
    <button className="key" {...keyProps(letter)} key={letter}>
      <span className="key-cap">{letter}</span>
      {pressed === letter && (
        <span className="key-pop" aria-hidden="true">
          {letter}
        </span>
      )}
    </button>
  )

  // Wordle's layout: half-key spacers indent the middle row, and Enter and Delete flank Z–M,
  // so every letter sits in the column it has on a phone keyboard.
  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      <div className="key-row">{ROWS[0].split('').map(letterKey)}</div>
      <div className="key-row">
        <div className="key-spacer" />
        {ROWS[1].split('').map(letterKey)}
        <div className="key-spacer" />
      </div>
      <div className="key-row">
        <button className="key key-wide key-enter" {...keyProps('enter')}>
          <span className="key-cap">Enter</span>
        </button>
        {ROWS[2].split('').map(letterKey)}
        <button className="key key-wide" {...keyProps('backspace')} aria-label="Delete">
          <span className="key-cap">
            <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true">
              <path
                d="M8 1h13a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-7-8z M12 6l6 6 M18 6l-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="key-row key-row-space">
        <button className="key key-space" {...keyProps('space')}>
          <span className="key-cap">space</span>
        </button>
      </div>
    </div>
  )
}
