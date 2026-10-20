import { puzzleNumberFor } from './date'

export interface Puzzle {
  id: number
  answer: string
  accepted: string[]
  image: string
  funFact: string
  credit: string
  creditUrl: string
  /** Point the zoom is anchored on, as fractions of width and height (0..1). Defaults to the centre. */
  focus?: { x: number; y: number }
}

/** Puzzle image paths are written from the site root; this adds the base path the site is served under. */
export function imageUrl(puzzle: Puzzle): string {
  return import.meta.env.BASE_URL + puzzle.image.replace(/^\//, '')
}

export type DailyPuzzle =
  | { kind: 'puzzle'; number: number; puzzle: Puzzle }
  | { kind: 'notLaunched' }
  | { kind: 'soldOut'; number: number }

/** puzzles[0] is puzzle #1 (launch day), puzzles[1] is #2, and so on. */
export function selectDailyPuzzle(puzzles: Puzzle[], dateKey: string, launchKey: string): DailyPuzzle {
  const number = puzzleNumberFor(dateKey, launchKey)
  if (number < 1) return { kind: 'notLaunched' }
  const puzzle = puzzles[number - 1]
  if (!puzzle) return { kind: 'soldOut', number }
  return { kind: 'puzzle', number, puzzle }
}
