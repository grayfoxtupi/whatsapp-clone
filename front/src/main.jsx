import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

//const router = createBrowserRouter([])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
