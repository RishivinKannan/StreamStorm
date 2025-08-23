import * as atatus from 'atatus-spa';
atatus.config(import.meta.env.VITE_ATATUS_RUM_API_KEY).install();

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
