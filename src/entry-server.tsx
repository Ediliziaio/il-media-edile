// Entry point SSR: renderizza una rotta in HTML statico (renderToString).
// Usa lo STESSO componente App del client: un solo albero di rotte, quindi
// l'idratazione combacia sempre (niente React error #418 e niente
// ri-rendering dell'HTML pre-renderizzato).
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

// Riesportate per lo script di prerender (unico bundle SSR da importare).
export { getAllPrerenderPaths, getSeoForPath } from '@/lib/seoData'
