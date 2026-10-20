import { describe, expect, it } from 'vitest'
import { dateKeyForPuzzle, formatCountdown, localDateKey, msUntilLocalMidnight, puzzleNumberFor } from './date'
import { selectDailyPuzzle, type Puzzle } from './puzzles'

const LAUNCH = '2026-10-19'

function fakePuzzle(id: number): Puzzle {
  return { id, answer: `Answer ${id}`, accepted: [], image: '', funFact: '', credit: '', creditUrl: '' }
}

describe('localDateKey', () => {
  it('uses the local calendar date', () => {
    expect(localDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(localDateKey(new Date(2026, 0, 6, 0, 0))).toBe('2026-01-06')
  })
})

describe('puzzleNumberFor', () => {
  it('is 1 on launch day and counts up from there', () => {
    expect(puzzleNumberFor('2026-10-19', LAUNCH)).toBe(1)
    expect(puzzleNumberFor('2026-10-20', LAUNCH)).toBe(2)
    expect(puzzleNumberFor('2026-11-19', LAUNCH)).toBe(32)
    expect(puzzleNumberFor('2027-10-19', LAUNCH)).toBe(366)
  })

  it('is 0 or less before launch', () => {
    expect(puzzleNumberFor('2026-10-18', LAUNCH)).toBe(0)
    expect(puzzleNumberFor('2026-01-01', LAUNCH)).toBeLessThan(0)
  })

  it('is not thrown off by daylight saving changes', () => {
    // US clocks go back on 2026-11-01 and forward on 2027-03-14
    expect(puzzleNumberFor('2026-11-02', '2026-10-31')).toBe(3)
    expect(puzzleNumberFor('2027-03-15', '2027-03-13')).toBe(3)
  })
})

describe('dateKeyForPuzzle', () => {
  it('is the inverse of puzzleNumberFor', () => {
    expect(dateKeyForPuzzle(1, LAUNCH)).toBe('2026-10-19')
    expect(dateKeyForPuzzle(14, LAUNCH)).toBe('2026-11-01')
    expect(dateKeyForPuzzle(366, LAUNCH)).toBe('2027-10-19')
    for (const n of [1, 2, 13, 14, 15, 100, 147]) expect(puzzleNumberFor(dateKeyForPuzzle(n, LAUNCH), LAUNCH)).toBe(n)
  })
})

describe('selectDailyPuzzle', () => {
  const puzzles = [fakePuzzle(1), fakePuzzle(2), fakePuzzle(3)]

  it('picks puzzle index = number - 1', () => {
    expect(selectDailyPuzzle(puzzles, '2026-10-19', LAUNCH)).toEqual({ kind: 'puzzle', number: 1, puzzle: puzzles[0] })
    expect(selectDailyPuzzle(puzzles, '2026-10-21', LAUNCH)).toEqual({ kind: 'puzzle', number: 3, puzzle: puzzles[2] })
  })

  it('reports when the list has run out', () => {
    expect(selectDailyPuzzle(puzzles, '2026-10-22', LAUNCH)).toEqual({ kind: 'soldOut', number: 4 })
  })

  it('reports before launch day', () => {
    expect(selectDailyPuzzle(puzzles, '2026-10-18', LAUNCH)).toEqual({ kind: 'notLaunched' })
  })
})

describe('countdown', () => {
  it('measures time to the next local midnight', () => {
    expect(msUntilLocalMidnight(new Date(2026, 9, 19, 23, 0))).toBe(60 * 60 * 1000)
  })

  it('formats as HH:MM, rounding up', () => {
    expect(formatCountdown(60 * 60 * 1000)).toBe('01:00')
    expect(formatCountdown(5 * 60 * 60 * 1000 + 30 * 1000)).toBe('05:01')
    expect(formatCountdown(1000)).toBe('00:01')
    expect(formatCountdown(0)).toBe('00:00')
  })
})
