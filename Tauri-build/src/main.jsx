import * as atatus from 'atatus-spa';
atatus.config(import.meta.env.VITE_ATATUS_RUM_API_KEY).install();

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';

import App from './App.jsx'
import { theme } from "./lib/theme.js"
import AppProviders from './lib/AppProviders.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppProviders>
        <App />
      </AppProviders>
    </ThemeProvider>
  </StrictMode>
)
