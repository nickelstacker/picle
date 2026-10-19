import { useEffect, useRef } from 'react'
import { MAX_GUESSES } from '../config'

interface Props {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="help"
      aria-labelledby="help-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop closes the dialog
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <h2 id="help-title">How to play</h2>
      <ul>
        <li>Every day there's one new photo, zoomed way in.</li>
        <li>Guess what it is. You have {MAX_GUESSES} tries.</li>
        <li>Each wrong guess zooms out a little more.</li>
      </ul>
      <button type="button" className="primary" onClick={onClose} autoFocus>
        Let's play
      </button>
    </dialog>
  )
}
