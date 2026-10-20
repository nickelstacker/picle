import { useEffect, useState } from 'react'
import { MAX_GUESSES, ZOOM_LEVELS } from '../config'
import { isCorrectGuess, normalise } from '../lib/match'
import type { DebugParams } from '../lib/debug'
import { loadGame, saveGame, type SavedGame } from '../lib/storage'
import { imageUrl, type Puzzle } from '../lib/puzzles'
import { EndPanel } from './EndPanel'
import { Keyboard, type Key } from './Keyboard'
import { Progress } from './Progress'
import { ZoomImage } from './ZoomImage'

const MAX_GUESS_LENGTH = 30
const MESSAGE_MS = 1800

interface Props {
  dateKey: string
  number: number
  puzzle: Puzzle
  msUntilNext: number
  /** Set for debug games, which neither load nor overwrite saved progress. */
  debug: DebugParams | null
}

export function Game({ dateKey, number, puzzle, msUntilNext, debug }: Props) {
  const persist = debug === null
  const [game, setGame] = useState<SavedGame>(
    () => (persist ? loadGame(dateKey) : null) ?? { guesses: [], status: 'playing' },
  )
  const [text, setText] = useState('')
  const [shake, setShake] = useState(false)
  // The id lets the same message show again (and restart its timer) on a repeat.
  const [message, setMessage] = useState<{ text: string; id: number } | null>(null)

  useEffect(() => {
    if (persist) saveGame(dateKey, game)
  }, [dateKey, game, persist])

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(() => setMessage(null), MESSAGE_MS)
    return () => window.clearTimeout(id)
  }, [message])

  const { guesses, status } = game
  const over = status !== 'playing'
  const won = status === 'won'
  const scale = over ? 1 : (debug?.zoom ?? ZOOM_LEVELS[Math.min(guesses.length, ZOOM_LEVELS.length - 1)])
  const defaultFocus = puzzle.focus ?? { x: 0.5, y: 0.5 }
  const focus = { x: debug?.x ?? defaultFocus.x, y: debug?.y ?? defaultFocus.y }

  function submit() {
    const guess = text.trim()
    const key = normalise(guess)
    if (!key) return
    if (guesses.some((g) => normalise(g) === key)) {
      setMessage({ text: 'Already tried that', id: Date.now() })
      setShake(true)
      return
    }

    const next = [...guesses, guess]
    setText('')
    if (isCorrectGuess(guess, puzzle.accepted)) {
      setGame({ guesses: next, status: 'won' })
    } else if (next.length >= MAX_GUESSES) {
      setGame({ guesses: next, status: 'lost' })
    } else {
      setGame({ guesses: next, status: 'playing' })
      setShake(true)
      const left = MAX_GUESSES - next.length
      setMessage({ text: `Not quite · ${left} ${left === 1 ? 'guess' : 'guesses'} left`, id: Date.now() })
    }
  }

  function handleKey(key: Key) {
    if (key === 'enter') submit()
    else if (key === 'backspace') setText((t) => t.slice(0, -1))
    else if (key === 'space') setText((t) => (t && !t.endsWith(' ') && t.length < MAX_GUESS_LENGTH ? t + ' ' : t))
    else setText((t) => (t.length < MAX_GUESS_LENGTH ? t + key : t))
  }

  // A physical keyboard drives the same keys.
  useEffect(() => {
    if (over) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      let key: Key | null = null
      if (e.key === 'Enter') key = 'enter'
      else if (e.key === 'Backspace') key = 'backspace'
      else if (e.key === ' ') key = 'space'
      else if (/^[a-z]$/i.test(e.key)) key = e.key.toLowerCase()
      if (!key) return
      e.preventDefault()
      handleKey(key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const image = (
    <ZoomImage
      src={imageUrl(puzzle)}
      scale={scale}
      focus={focus}
      // The answer only enters the page once the game is over.
      alt={over ? `Photo of ${puzzle.answer}` : 'Mystery photo, zoomed in'}
      shake={shake}
      onShakeEnd={() => setShake(false)}
    />
  )

  if (over) {
    return (
      <main className="game">
        {image}
        <Progress used={guesses.length} won={won} />
        <EndPanel puzzle={puzzle} number={number} guessCount={guesses.length} won={won} msUntilNext={msUntilNext} />
      </main>
    )
  }

  return (
    <main className="game playing">
      <div className="photo-area">
        {image}
        <div className="toast" role="status" aria-live="polite">
          {message && <span key={message.id}>{message.text}</span>}
        </div>
      </div>

      {debug && (
        <p className="debug">
          Debug · day {number} · x={focus.x} y={focus.y} · zoom={scale}
        </p>
      )}

      <Progress used={guesses.length} won={false} />

      <p className="guess-display" aria-live="off">
        <span className="visually-hidden">Your guess: </span>
        {text ? <span>{text}</span> : <span className="placeholder">What is it?</span>}
        <span className="caret" aria-hidden="true" />
      </p>

      <Keyboard onKey={handleKey} canSubmit={normalise(text) !== ''} />
    </main>
  )
}
