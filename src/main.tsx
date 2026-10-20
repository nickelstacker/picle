import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'
import { isDebug, parseDebugParams } from './lib/debug'

// Only real visits to the deployed site are counted: not local development or debug games.
if (import.meta.env.PROD && !isDebug(parseDebugParams(window.location.search))) initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
