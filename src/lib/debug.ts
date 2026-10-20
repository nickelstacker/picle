export interface DebugParams {
  /** Puzzle number to play instead of today's. */
  day: number | null
  /** Overrides for the puzzle's focus point, each 0..1. */
  x: number | null
  y: number | null
  /** Fixed zoom shown while playing, instead of stepping through the zoom levels. */
  zoom: number | null
}

function parseNumber(value: string | null, min: number, max: number): number | null {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= min && n <= max ? n : null
}

/** Reads ?day=N, ?x=, ?y= and ?zoom= from a query string. Missing or invalid values are null. */
export function parseDebugParams(search: string): DebugParams {
  const params = new URLSearchParams(search)
  const day = params.get('day')
  return {
    day: day && /^[1-9]\d*$/.test(day) ? Number(day) : null,
    x: parseNumber(params.get('x'), 0, 1),
    y: parseNumber(params.get('y'), 0, 1),
    zoom: parseNumber(params.get('zoom'), 1, 100),
  }
}

export function isDebug(params: DebugParams): boolean {
  return params.day !== null || params.x !== null || params.y !== null || params.zoom !== null
}
