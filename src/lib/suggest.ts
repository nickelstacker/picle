import { normalise } from './match'

/** Answers that start with the query come first, then answers with a word starting with it. */
export function suggest(query: string, answers: string[], exclude: Set<string>, limit = 6): string[] {
  const q = normalise(query)
  if (!q) return []
  const starts: string[] = []
  const wordStarts: string[] = []
  for (const answer of answers) {
    const a = normalise(answer)
    if (exclude.has(a)) continue
    if (a.startsWith(q)) starts.push(answer)
    else if (a.includes(' ' + q)) wordStarts.push(answer)
  }
  return [...starts, ...wordStarts].slice(0, limit)
}
