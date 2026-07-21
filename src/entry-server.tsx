// Entry point SSR: renderizza una rotta in HTML statico (renderToString).
// Usa AppStatic (import diretti, niente React.lazy) perché renderToString
// non risolve i componenti lazy.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import AppStatic from './AppStatic'

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppStatic />
    </StaticRouter>,
  )
}

// Riesportate per lo script di prerender (unico bundle SSR da importare).
export { getAllPrerenderPaths, getSeoForPath } from '@/lib/seoData'
