import { GAME_NAME, MAX_GUESSES } from '../config'

export function buildShareText(puzzleNumber: number, guessCount: number, won: boolean, url: string): string {
  const score = won ? `${guessCount}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`
  const squares = won ? '⬜'.repeat(guessCount - 1) + '🟩' : '⬜'.repeat(MAX_GUESSES)
  return `${GAME_NAME} #${puzzleNumber} ${score}\n${squares}\n${url}`
}
