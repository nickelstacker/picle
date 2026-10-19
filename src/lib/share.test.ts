import { describe, expect, it } from 'vitest'
import { buildShareText } from './share'

describe('buildShareText', () => {
  it('shows wrong guesses then the winning square', () => {
    expect(buildShareText(12, 3, true, 'https://picle.example')).toBe('Picle #12 3/6\n⬜⬜🟩\nhttps://picle.example')
    expect(buildShareText(1, 1, true, 'https://picle.example')).toBe('Picle #1 1/6\n🟩\nhttps://picle.example')
  })

  it('shows X and six blank squares for a loss', () => {
    expect(buildShareText(12, 6, false, 'https://picle.example')).toBe('Picle #12 X/6\n⬜⬜⬜⬜⬜⬜\nhttps://picle.example')
  })
})
