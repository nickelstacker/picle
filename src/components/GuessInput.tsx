import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { normalise } from '../lib/match'
import { suggest } from '../lib/suggest'
import answers from '../data/answers.json'

interface Props {
  previousGuesses: string[]
  onGuess: (guess: string) => void
}

export function GuessInput({ previousGuesses, onGuess }: Props) {
  const [value, setValue] = useState('')
  const [active, setActive] = useState(-1)
  const listId = useId()

  const exclude = useMemo(() => new Set(previousGuesses.map(normalise)), [previousGuesses])
  const options = useMemo(() => suggest(value, answers, exclude), [value, exclude])
  const open = options.length > 0

  function submit(guess: string) {
    if (!guess.trim()) return
    onGuess(guess.trim())
    setValue('')
    setActive(-1)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && open) {
      e.preventDefault()
      setActive((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault()
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setActive(-1)
      setValue('')
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit(active >= 0 && open ? options[active] : value)
    }
  }

  return (
    <div className="guess-input">
      <label htmlFor={`${listId}-input`} className="visually-hidden">
        Your guess
      </label>
      <div className="input-row">
        <input
          id={`${listId}-input`}
          type="text"
          placeholder="What is it?"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && open ? `${listId}-${active}` : undefined}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setActive(-1)
          }}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="guess-button" onClick={() => submit(value)} disabled={!value.trim()}>
          Guess
        </button>
      </div>
      {open && (
        <ul id={listId} role="listbox" className="suggestions">
          {options.map((option, i) => (
            <li
              key={option}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : undefined}
              // mousedown keeps focus in the input so the keyboard stays open on mobile
              onMouseDown={(e) => {
                e.preventDefault()
                submit(option)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
