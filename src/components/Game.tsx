import { useEffect, useState } from 'react'
import { MAX_GUESSES, ZOOM_LEVELS } from '../config'
import { isCorrectGuess, normalise } from '../lib/match'
import { loadGame, saveGame, type SavedGame } from '../lib/storage'
import { imageUrl, type Puzzle } from '../lib/puzzles'
import { EndPanel } from './EndPanel'
import { GuessInput } from './GuessInput'
import { Progress } from './Progress'
import { ZoomImage } from './ZoomImage'

interface Props {
  dateKey: string
  number: number
  puzzle: Puzzle
  msUntilNext: number
  /** False for debug games, which neither load nor overwrite saved progress. */
  persist: boolean
}

export function Game({ dateKey, number, puzzle, msUntilNext, persist }: Props) {
  const [game, setGame] = useState<SavedGame>(
    () => (persist ? loadGame(dateKey) : null) ?? { guesses: [], status: 'playing' },
  )
  const [shake, setShake] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (persist) saveGame(dateKey, game)
  }, [dateKey, game, persist])

  const { guesses, status } = game
  const over = status !== 'playing'
  const won = status === 'won'
  const wrongGuesses = won ? guesses.slice(0, -1) : guesses
  const scale = over ? 1 : ZOOM_LEVELS[Math.min(guesses.length, ZOOM_LEVELS.length - 1)]

  function handleGuess(guess: string) {
    if (over) return
    const key = normalise(guess)
    if (!key) return
    if (guesses.some((g) => normalise(g) === key)) {
      setMessage(`You already tried “${guess}”.`)
      return
    }

    const next = [...guesses, guess]
    if (isCorrectGuess(guess, puzzle.accepted)) {
      setGame({ guesses: next, status: 'won' })
      setMessage('')
    } else if (next.length >= MAX_GUESSES) {
      setGame({ guesses: next, status: 'lost' })
      setMessage('')
    } else {
      setGame({ guesses: next, status: 'playing' })
      setShake(true)
      const left = MAX_GUESSES - next.length
      setMessage(`Not quite. Zooming out. ${left} ${left === 1 ? 'guess' : 'guesses'} left.`)
    }
  }

  return (
    <main className="game">
      <ZoomImage
        src={imageUrl(puzzle)}
        scale={scale}
        focus={puzzle.focus ?? { x: 0.5, y: 0.5 }}
        // The answer only enters the page once the game is over.
        alt={over ? `Photo of ${puzzle.answer}` : 'Mystery photo, zoomed in'}
        shake={shake}
        onShakeEnd={() => setShake(false)}
      />

      <Progress used={guesses.length} won={won} />

      {!over && <GuessInput onGuess={handleGuess} />}

      <p className="message" role="status" aria-live="polite">
        {message}
      </p>

      {wrongGuesses.length > 0 && (
        <ul className="guess-list" aria-label="Your wrong guesses">
          {wrongGuesses.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      )}

      {over && (
        <EndPanel puzzle={puzzle} number={number} guessCount={guesses.length} won={won} msUntilNext={msUntilNext} />
      )}
    </main>
  )
}
