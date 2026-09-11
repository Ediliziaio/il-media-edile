import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { salvaParametriCampagna } from './lib/eicLead'

// Salva UTM/gclid/fbclid all'atterraggio: l'iscrizione può avvenire su un'altra pagina.
salvaParametriCampagna()

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Se la pagina è stata pre-renderizzata (build statica), il root contiene già
// l'HTML server-side: idrata invece di ri-renderizzare da zero.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
