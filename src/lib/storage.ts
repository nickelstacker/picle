export type GameStatus = 'playing' | 'won' | 'lost'

export interface SavedGame {
  guesses: string[]
  status: GameStatus
}

const GAME_PREFIX = 'picle:game:'
const SEEN_HELP_KEY = 'picle:seenHelp'

// Storage can be unavailable (private mode, blocked site data), so every access is guarded.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // The game still works for this session without persistence.
  }
}

export function loadGame(dateKey: string): SavedGame | null {
  const raw = read(GAME_PREFIX + dateKey)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SavedGame
    if (!Array.isArray(parsed.guesses) || !['playing', 'won', 'lost'].includes(parsed.status)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveGame(dateKey: string, game: SavedGame): void {
  write(GAME_PREFIX + dateKey, JSON.stringify(game))
}

export function hasSeenHelp(): boolean {
  return read(SEEN_HELP_KEY) === '1'
}

export function markHelpSeen(): void {
  write(SEEN_HELP_KEY, '1')
}
