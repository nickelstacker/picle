import { MAX_GUESSES } from '../config'

interface Props {
  used: number
  won: boolean
}

export function Progress({ used, won }: Props) {
  return (
    <div className="progress" role="img" aria-label={`${used} of ${MAX_GUESSES} guesses used`}>
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const state = i >= used ? '' : won && i === used - 1 ? 'dot-win' : 'dot-used'
        return <span key={i} className={`dot ${state}`} />
      })}
    </div>
  )
}
