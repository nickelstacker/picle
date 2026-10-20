import { useEffect, useState } from 'react'
import { GAME_NAME, LAUNCH_DATE } from './config'
import { dateKeyForPuzzle, localDateKey, msUntilLocalMidnight } from './lib/date'
import { isDebug, parseDebugParams } from './lib/debug'
import { selectDailyPuzzle, type Puzzle } from './lib/puzzles'
import { Game } from './components/Game'
import puzzles from './data/puzzles.json'

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export default function App({ analyticsOff }: { analyticsOff: boolean }) {
  const now = useNow(15_000)
  // For debugging: ?day=N plays puzzle #N, ?x= and ?y= move the focus point, ?zoom= fixes the zoom.
  const debug = parseDebugParams(window.location.search)
  const dateKey = debug.day ? dateKeyForPuzzle(debug.day, LAUNCH_DATE) : localDateKey(now)
  const daily = selectDailyPuzzle(puzzles as Puzzle[], dateKey, LAUNCH_DATE)
  const msUntilNext = msUntilLocalMidnight(now)

  return (
    <div className="app">
      <header className="header">
        <h1>{GAME_NAME}</h1>
      </header>

      {analyticsOff && <p className="analytics-off">Not counted on this device</p>}

      {daily.kind === 'puzzle' ? (
        // Keyed by date so a fresh game starts when the day rolls over at local midnight.
        <Game
          key={dateKey}
          dateKey={dateKey}
          number={daily.number}
          puzzle={daily.puzzle}
          msUntilNext={msUntilNext}
          debug={isDebug(debug) ? debug : null}
        />
      ) : (
        <main className="game empty">
          <p className="empty-title">{daily.kind === 'notLaunched' ? `${GAME_NAME} is coming soon.` : 'New puzzles coming soon.'}</p>
          <p>Thanks for playing. Check back later!</p>
        </main>
      )}
    </div>
  )
}
