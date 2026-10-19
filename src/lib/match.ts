/** Lowercases, strips punctuation and accents, collapses spaces and drops a leading "the", "a" or "an". */
export function normalise(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '')
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    prev = curr
  }
  return prev[b.length]
}

/** Typos allowed for an answer of this length: none for very short words, up to 2 for long ones. */
export function allowedTypos(length: number): number {
  if (length <= 4) return 0
  if (length <= 8) return 1
  return 2
}

export function isCorrectGuess(guess: string, accepted: string[]): boolean {
  const g = normalise(guess)
  if (!g) return false
  return accepted.some((answer) => {
    const a = normalise(answer)
    return levenshtein(g, a) <= allowedTypos(a.length)
  })
}
