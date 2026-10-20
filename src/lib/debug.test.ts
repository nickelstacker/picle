import { describe, expect, it } from 'vitest'
import { isDebug, parseDebugParams } from './debug'

describe('parseDebugParams', () => {
  it('reads all params', () => {
    expect(parseDebugParams('?day=2&x=0.65&y=0.87&zoom=16')).toEqual({ day: 2, x: 0.65, y: 0.87, zoom: 16 })
  })

  it('treats missing params as null', () => {
    expect(parseDebugParams('')).toEqual({ day: null, x: null, y: null, zoom: null })
    expect(parseDebugParams('?x=0.3')).toEqual({ day: null, x: 0.3, y: null, zoom: null })
  })

  it('ignores invalid values', () => {
    expect(parseDebugParams('?day=0&x=1.5&y=-0.1&zoom=0.5')).toEqual({ day: null, x: null, y: null, zoom: null })
    expect(parseDebugParams('?day=abc&x=left&y=&zoom=lots')).toEqual({ day: null, x: null, y: null, zoom: null })
    expect(parseDebugParams('?day=2.5')).toEqual({ day: null, x: null, y: null, zoom: null })
  })

  it('accepts the edges of each range', () => {
    expect(parseDebugParams('?x=0&y=1&zoom=1')).toEqual({ day: null, x: 0, y: 1, zoom: 1 })
  })
})

describe('isDebug', () => {
  it('is true when any param is set', () => {
    expect(isDebug(parseDebugParams(''))).toBe(false)
    expect(isDebug(parseDebugParams('?zoom=8'))).toBe(true)
    expect(isDebug(parseDebugParams('?day=1'))).toBe(true)
  })
})
