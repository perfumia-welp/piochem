import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Suppress THREE.Clock deprecation warning emitted by @react-three/fiber / drei internals.
// THREE.Clock still functions correctly; the warning is a soft deprecation only.
const _warn = console.warn.bind(console)
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
  _warn(...args)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
