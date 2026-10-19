import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { normalise } from '../lib/match'
import type { Puzzle } from '../lib/puzzles'
import answers from './answers.json'
import puzzleData from './puzzles.json'

const puzzles = puzzleData as Puzzle[]
const answerSet = new Set(answers.map(normalise))

describe('puzzles.json', () => {
  it('has sequential ids starting at 1', () => {
    puzzles.forEach((p, i) => expect(p.id).toBe(i + 1))
  })

  it.each(puzzles.map((p) => [p.id, p] as const))('puzzle %i is complete', (_, p) => {
    expect(p.answer).toBeTruthy()
    expect(p.accepted.length).toBeGreaterThan(0)
    expect(p.accepted.map(normalise)).toContain(normalise(p.answer))
    expect(p.funFact).toBeTruthy()
    expect(p.credit).toBeTruthy()
    expect(p.creditUrl).toMatch(/^https:\/\//)
    expect(existsSync(join(process.cwd(), 'public', p.image))).toBe(true)
    // Filenames must not give the answer away
    expect(p.image).toMatch(/^\/puzzles\/\d{3}\.jpg$/)
  })

  it('every answer can be picked from the autocomplete list', () => {
    for (const p of puzzles) expect(answerSet.has(normalise(p.answer)), p.answer).toBe(true)
  })
})

describe('answers.json', () => {
  it('has at least 300 unique answers', () => {
    expect(answerSet.size).toBe(answers.length)
    expect(answers.length).toBeGreaterThanOrEqual(300)
  })
})
