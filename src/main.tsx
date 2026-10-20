import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyAnalyticsOptOut, initAnalytics } from './lib/analytics'
import { isDebug, parseDebugParams } from './lib/debug'

// Only real visits to the deployed site are counted: not local development, debug games,
// or devices opted out with ?analytics=off.
const optedOut = applyAnalyticsOptOut(window.location.search)
if (import.meta.env.PROD && !optedOut && !isDebug(parseDebugParams(window.location.search))) initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App analyticsOff={optedOut} />
  </StrictMode>,
)
