const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Local calendar date as YYYY-MM-DD. */
export function localDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dayIndex(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  // Counting whole days via UTC avoids off-by-one errors around daylight saving changes.
  return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY)
}

/** Puzzle number for a local date: 1 on launch day, 0 or less before it. */
export function puzzleNumberFor(dateKey: string, launchKey: string): number {
  return dayIndex(dateKey) - dayIndex(launchKey) + 1
}

/** Local date (YYYY-MM-DD) on which a given puzzle number is played. */
export function dateKeyForPuzzle(number: number, launchKey: string): string {
  const [y, m, d] = launchKey.split('-').map(Number)
  return localDateKey(new Date(y, m - 1, d + number - 1))
}

export function msUntilLocalMidnight(now: Date): number {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return midnight.getTime() - now.getTime()
}

/** Formats a duration as HH:MM, rounding up so it never shows 00:00 before midnight. */
export function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
