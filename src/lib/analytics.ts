// GoatCounter: cookie-free page views and game events. Dashboard: https://nickelstacker.goatcounter.com
const COUNT_URL = 'https://nickelstacker.goatcounter.com/count'
const SCRIPT_URL = 'https://gc.zgo.at/count.js'

interface GoatCounter {
  count: (vars: { path: string; title?: string; event?: boolean }) => void
}

declare global {
  interface Window {
    goatcounter?: GoatCounter
  }
}

let enabled = false
// Events sent before the script has loaded wait here.
const pending: { path: string; title: string }[] = []

function flush() {
  const gc = window.goatcounter
  if (!gc?.count) return
  for (const e of pending.splice(0)) gc.count({ ...e, event: true })
}

/** Loads GoatCounter, which also records the page view. Call once, and only for real (non-debug) production visits. */
export function initAnalytics(): void {
  if (enabled) return
  enabled = true
  const script = document.createElement('script')
  script.async = true
  script.src = SCRIPT_URL
  script.dataset.goatcounter = COUNT_URL
  script.addEventListener('load', flush)
  document.head.appendChild(script)
}

/** Records a game event such as "puzzle-4-won-in-3". Does nothing unless analytics is on. */
export function trackEvent(path: string, title: string): void {
  if (!enabled) return
  pending.push({ path, title })
  flush()
}
