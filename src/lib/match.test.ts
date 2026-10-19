import { describe, expect, it } from 'vitest'
import { isCorrectGuess, levenshtein, normalise } from './match'

const liberty = ['statue of liberty', 'lady liberty', 'liberty statue']

describe('normalise', () => {
  it('lowercases, trims and collapses spaces', () => {
    expect(normalise('  Statue   OF Liberty ')).toBe('statue of liberty')
  })

  it('strips punctuation and accents', () => {
    expect(normalise("St. Basil's Cathedral!")).toBe('st basils cathedral')
    expect(normalise('Crème brûlée')).toBe('creme brulee')
  })

  it('drops a leading article', () => {
    expect(normalise('The Eiffel Tower')).toBe('eiffel tower')
    expect(normalise('a pineapple')).toBe('pineapple')
    expect(normalise('An owl')).toBe('owl')
  })

  it('keeps words that only start with an article', () => {
    expect(normalise('Anteater')).toBe('anteater')
    expect(normalise('Theatre')).toBe('theatre')
  })
})

describe('levenshtein', () => {
  it('counts edits', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3)
    expect(levenshtein('abc', 'abc')).toBe(0)
    expect(levenshtein('', 'abc')).toBe(3)
  })
})

describe('isCorrectGuess', () => {
  it('accepts exact and alternative answers', () => {
    expect(isCorrectGuess('Statue of Liberty', liberty)).toBe(true)
    expect(isCorrectGuess('the statue of liberty', liberty)).toBe(true)
    expect(isCorrectGuess('Lady Liberty!', liberty)).toBe(true)
  })

  it('accepts small typos on longer answers', () => {
    expect(isCorrectGuess('statue of libery', liberty)).toBe(true)
    expect(isCorrectGuess('statoo of liberty', liberty)).toBe(true)
    expect(isCorrectGuess('pinapple', ['pineapple'])).toBe(true)
  })

  it('rejects guesses that are too far off', () => {
    expect(isCorrectGuess('statue of david', liberty)).toBe(false)
    expect(isCorrectGuess('liberty bell', liberty)).toBe(false)
  })

  it('needs exact matches for short answers', () => {
    expect(isCorrectGuess('cat', ['cat'])).toBe(true)
    expect(isCorrectGuess('bat', ['cat'])).toBe(false)
    expect(isCorrectGuess('owl', ['owl'])).toBe(true)
    expect(isCorrectGuess('ow', ['owl'])).toBe(false)
  })

  it('allows one typo for medium answers', () => {
    expect(isCorrectGuess('giraff', ['giraffe'])).toBe(true)
    expect(isCorrectGuess('girafe', ['giraffe'])).toBe(true)
    expect(isCorrectGuess('grafe', ['giraffe'])).toBe(false)
  })

  it('rejects empty guesses', () => {
    expect(isCorrectGuess('   ', liberty)).toBe(false)
    expect(isCorrectGuess('!!', liberty)).toBe(false)
  })
})
