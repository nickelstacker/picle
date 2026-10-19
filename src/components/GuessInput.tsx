import { useState, type FormEvent } from 'react'

interface Props {
  onGuess: (guess: string) => void
}

export function GuessInput({ onGuess }: Props) {
  const [value, setValue] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    onGuess(value.trim())
    setValue('')
  }

  return (
    <form className="input-row" onSubmit={onSubmit}>
      <label htmlFor="guess" className="visually-hidden">
        Your guess
      </label>
      <input
        id="guess"
        type="text"
        placeholder="What is it?"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="go"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="guess-button" disabled={!value.trim()}>
        Guess
      </button>
    </form>
  )
}
