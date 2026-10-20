import type { MouseEvent } from 'react'

export type Key = string | 'space' | 'backspace' | 'enter'

interface Props {
  onKey: (key: Key) => void
  canSubmit: boolean
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

export function Keyboard({ onKey, canSubmit }: Props) {
  // Keys never take focus, so typing on a physical keyboard keeps working after a tap.
  const keyProps = (key: Key) => ({
    type: 'button' as const,
    tabIndex: -1,
    onMouseDown: (e: MouseEvent) => e.preventDefault(),
    onClick: () => onKey(key),
  })

  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {ROWS.map((row, i) => (
        <div className="key-row" key={row}>
          {row.split('').map((letter) => (
            <button className="key" {...keyProps(letter)} key={letter}>
              {letter}
            </button>
          ))}
          {i === ROWS.length - 1 && (
            <button className="key key-wide" {...keyProps('backspace')} aria-label="Delete">
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
            </button>
          )}
        </div>
      ))}
      <div className="key-row">
        <button className="key key-space" {...keyProps('space')}>
          space
        </button>
        <button className="key key-enter" {...keyProps('enter')} disabled={!canSubmit}>
          Guess
        </button>
      </div>
    </div>
  )
}
