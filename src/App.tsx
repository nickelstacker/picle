import { useEffect, useState } from 'react'
import { GAME_NAME, LAUNCH_DATE } from './config'
import { isValidDateKey, localDateKey, msUntilLocalMidnight } from './lib/date'
import { selectDailyPuzzle, type Puzzle } from './lib/puzzles'
import { hasSeenHelp, markHelpSeen } from './lib/storage'
import { Game } from './components/Game'
import { HelpModal } from './components/HelpModal'
import puzzles from './data/puzzles.json'

// In development, ?date=YYYY-MM-DD plays a different day's puzzle.
function devDateOverride(): string | null {
  if (!import.meta.env.DEV) return null
  const date = new URLSearchParams(window.location.search).get('date')
  return date && isValidDateKey(date) ? date : null
}

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export default function App() {
  const now = useNow(15_000)
  const [helpOpen, setHelpOpen] = useState(() => !hasSeenHelp())
  const dateKey = devDateOverride() ?? localDateKey(now)
  const daily = selectDailyPuzzle(puzzles as Puzzle[], dateKey, LAUNCH_DATE)
  const msUntilNext = msUntilLocalMidnight(now)

  function closeHelp() {
    setHelpOpen(false)
    markHelpSeen()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>{GAME_NAME}</h1>
        <button type="button" className="help-button" aria-label="How to play" onClick={() => setHelpOpen(true)}>
          ?
        </button>
      </header>

      {daily.kind === 'puzzle' ? (
        // Keyed by date so a fresh game starts when the day rolls over at local midnight.
        <Game key={dateKey} dateKey={dateKey} number={daily.number} puzzle={daily.puzzle} msUntilNext={msUntilNext} />
      ) : (
        <main className="game empty">
          <p className="empty-title">{daily.kind === 'notLaunched' ? `${GAME_NAME} is coming soon.` : 'New puzzles coming soon.'}</p>
          <p>Thanks for playing. Check back later!</p>
        </main>
      )}

      <HelpModal open={helpOpen} onClose={closeHelp} />
    </div>
  )
}
