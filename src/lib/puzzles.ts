import { puzzleNumberFor } from './date'

export interface Puzzle {
  id: number
  answer: string
  accepted: string[]
  image: string
  funFact: string
  credit: string
  creditUrl: string
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
