import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FallingThings from './spawn.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <FallingThings spawnRate={360} max={28} />
    <App />
  </StrictMode>,
)
