import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n.js'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center font-mono text-saffron-500 uppercase tracking-widest animate-pulse">Initializing Strategic Node...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
)
