// Gestione SEO lato client: title, meta, canonical, JSON-LD
import { useEffect } from 'react'
import { SITE_URL } from './articles'

export interface SeoOptions {
  title: string
  description: string
  canonical?: string
  type?: 'website' | 'article'
  image?: string
  published?: string
  modified?: string
  section?: string
  tags?: string[]
  /** true = noindex,follow (pagine sottili: tag, archivi) */
  noindex?: boolean
  jsonLd?: object | object[]
}

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1'
const ROBOTS_NOINDEX = 'noindex, follow'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo(opts: SeoOptions) {
  useEffect(() => {
    // Guard SSR: nel pre-rendering (renderToString) gli effetti non girano,
    // ma proteggiamo comunque l'accesso a document/window.
    if (typeof document === 'undefined') return
    document.title = opts.title
    upsertMeta('name', 'description', opts.description)
    // robots: aggiornato a ogni navigazione client (index <-> noindex)
    upsertMeta('name', 'robots', opts.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX)
    upsertMeta('property', 'og:title', opts.title)
    upsertMeta('property', 'og:description', opts.description)
    upsertMeta('property', 'og:type', opts.type ?? 'website')
    upsertMeta('name', 'twitter:title', opts.title)
    upsertMeta('name', 'twitter:description', opts.description)
    if (opts.image) {
      upsertMeta('property', 'og:image', opts.image)
      upsertMeta('name', 'twitter:image', opts.image)
    }
    if (opts.published) upsertMeta('property', 'article:published_time', opts.published)
    if (opts.modified) upsertMeta('property', 'article:modified_time', opts.modified)
    if (opts.section) upsertMeta('property', 'article:section', opts.section)
    if (opts.tags) {
      document.head.querySelectorAll('meta[property="article:tag"]').forEach((e) => e.remove())
      opts.tags.forEach((t) => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'article:tag')
        el.setAttribute('content', t)
        document.head.appendChild(el)
      })
    }
    const canonicalUrl = opts.canonical ?? `${SITE_URL}${typeof window !== 'undefined' ? window.location.pathname : ''}`
    upsertMeta('property', 'og:url', canonicalUrl)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonicalUrl

    // JSON-LD per pagina
    const id = 'page-jsonld'
    document.getElementById(id)?.remove()
    if (opts.jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(opts.jsonLd)
      document.head.appendChild(s)
    }
    window.scrollTo(0, 0)
  }, [JSON.stringify(opts)]) // eslint-disable-line react-hooks/exhaustive-deps
}
