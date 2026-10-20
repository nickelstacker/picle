import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyAnalyticsOptOut } from './analytics'

describe('applyAnalyticsOptOut', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('is off by default', () => {
    expect(applyAnalyticsOptOut('')).toBe(false)
  })

  it('remembers ?analytics=off on later visits', () => {
    expect(applyAnalyticsOptOut('?analytics=off')).toBe(true)
    expect(applyAnalyticsOptOut('')).toBe(true)
    expect(applyAnalyticsOptOut('?day=3')).toBe(true)
  })

  it('turns back on with ?analytics=on', () => {
    applyAnalyticsOptOut('?analytics=off')
    expect(applyAnalyticsOptOut('?analytics=on')).toBe(false)
    expect(applyAnalyticsOptOut('')).toBe(false)
  })

  it('still honours ?analytics=off for this visit when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {},
    })
    expect(applyAnalyticsOptOut('?analytics=off')).toBe(true)
    expect(applyAnalyticsOptOut('')).toBe(false)
  })
})
