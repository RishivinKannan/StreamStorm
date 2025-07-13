import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { VisitCountProvider } from './context/VisitCountContext.jsx'
import { DownloadCountProvider } from './context/DownloadCountContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VisitCountProvider>
      <DownloadCountProvider>
        <App />
      </DownloadCountProvider>
    </VisitCountProvider>
  </StrictMode>
)
