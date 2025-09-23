import '@/styles/style.scss?style'
import { StrictMode, use } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
