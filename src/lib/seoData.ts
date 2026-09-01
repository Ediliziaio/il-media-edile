// Sorgente unica dei metadati SEO per pagina.
// Usata sia dalle pagine (via useSeo) sia dallo script di prerender
// (scripts/prerender.mjs) per iniettare title/meta/canonical/JSON-LD
// nell'HTML statico di ogni rotta.
import {
  articles,
  sections,
  getArticle,
  getBySection,
  getRankings,
  articleUrl,
  ogImage,
  inlineImage,
  SITE_URL,
  SITE_NAME,
  type Article,
  type ArticleBlock,
} from './articles'
import type { SeoOptions } from './seo'
import { brands } from '@/data/brands.generated'

export type Section = (typeof sections)[number]
export type StaticPageId = 'chi-siamo' | 'contatti' | 'privacy' | 'cookie-policy'

export function homeSeo(): SeoOptions {
  const rankings = getRankings()
  return {
    // Posizionamento distintivo: non l'ennesimo sito di news di settore, ma il
    // sito delle classifiche comparative con dati aperti (l'asset che nessun
    // altro portale edile pubblica).
    title: 'Il Media Edile — Classifiche e confronti dei migliori produttori edili',
    description: `${rankings.length} classifiche indipendenti dell’edilizia italiana: serramenti, impianti, materiali, software BIM e macchine da cantiere. Criteri di valutazione dichiarati, tabelle comparative e dati scaricabili in CSV.`,
    canonical: `${SITE_URL}/`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Ultimi articoli de Il Media Edile',
        itemListElement: articles.slice(0, 10).map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/${a.sectionSlug}/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  }
}

export function sectionSeo(section: Section): SeoOptions {
  const items = getBySection(section.slug)
  return {
    title: `${section.name} — ${SITE_NAME}`,
    description: `${section.description} Tutti gli articoli della sezione ${section.name} de Il Media Edile.`,
    canonical: `${SITE_URL}/${section.slug}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${section.name} — ${SITE_NAME}`,
        description: section.description,
        url: `${SITE_URL}/${section.slug}`,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: section.name, item: `${SITE_URL}/${section.slug}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Articoli della sezione ${section.name}`,
        itemListElement: items.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/${a.sectionSlug}/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  }
}

export function classificheSeo(): SeoOptions {
  const rankings = getRankings()
  return {
    title: `Classifiche dell'edilizia: ${rankings.length} confronti con dati aperti | ${SITE_NAME}`,
    description: `${rankings.length} classifiche indipendenti di produttori e prodotti edili: serramenti, impianti, materiali, software BIM e macchine da cantiere. Criteri di valutazione dichiarati, tabelle comparative e dataset CSV riutilizzabili.`,
    canonical: `${SITE_URL}/classifiche`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Le Classifiche — ${SITE_NAME}`,
        description: 'Indice di tutte le classifiche Top 10 e Top 5 dell’edilizia de Il Media Edile.',
        url: `${SITE_URL}/classifiche`,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Classifiche', item: `${SITE_URL}/classifiche` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Tutte le classifiche de Il Media Edile',
        itemListElement: rankings.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}${articleUrl(a)}`,
          name: a.title,
        })),
      },
    ],
  }
}

export function newsletterSeo(): SeoOptions {
  return {
    title: `Newsletter — La newsletter del cantiere | ${SITE_NAME}`,
    description: 'Iscriviti alla newsletter de Il Media Edile: ogni mattina alle 7 le notizie che contano per imprese, professionisti e produttori dell’edilizia. Gratuita, con doppio opt-in.',
    canonical: `${SITE_URL}/newsletter`,
  }
}

/** Shell della pagina di ricerca: la query è client-side. */
export function searchSeo(): SeoOptions {
  return {
    title: `Cerca — ${SITE_NAME}`,
    description: `Cerca tra notizie, classifiche e guide sull'edilizia de Il Media Edile.`,
    canonical: `${SITE_URL}/cerca`,
    // Shell di ricerca senza contenuto proprio: mai in indice (thin/duplicato).
    noindex: true,
  }
}

const STATIC_PAGES: Record<StaticPageId, { title: string; description: string }> = {
  'chi-siamo': {
    title: `Chi siamo — ${SITE_NAME}`,
    description: 'Chi c’è dietro Il Media Edile: redazione, linea editoriale, metodo con cui costruiamo le classifiche e dati dell’editore Domus Group S.r.l.',
  },
  contatti: {
    title: `Contatti e pubblicità — ${SITE_NAME}`,
    description: 'Come contattare la redazione de Il Media Edile: segnalazioni, comunicati stampa, partnership editoriali e informazioni sugli spazi pubblicitari.',
  },
  privacy: {
    title: `Privacy policy — ${SITE_NAME}`,
    description: 'Informativa sul trattamento dei dati personali degli utenti de Il Media Edile ai sensi del GDPR.',
  },
  'cookie-policy': {
    title: `Cookie policy — ${SITE_NAME}`,
    description: 'Informativa sull’uso dei cookie sul sito Il Media Edile: cookie tecnici, analitici e pubblicitari.',
  },
}

const STATIC_PAGE_TYPE: Record<StaticPageId, string> = {
  'chi-siamo': 'AboutPage',
  contatti: 'ContactPage',
  privacy: 'WebPage',
  'cookie-policy': 'WebPage',
}

const STATIC_PAGE_LABEL: Record<StaticPageId, string> = {
  'chi-siamo': 'Chi siamo',
  contatti: 'Contatti',
  privacy: 'Privacy policy',
  'cookie-policy': 'Cookie policy',
}

export function staticPageSeo(page: StaticPageId): SeoOptions {
  const c = STATIC_PAGES[page]
  const url = `${SITE_URL}/${page}`
  return {
    title: c.title,
    description: c.description,
    canonical: url,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': STATIC_PAGE_TYPE[page],
        name: c.title,
        description: c.description,
        url,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        // /chi-siamo descrive l'organizzazione: aggancia l'entità editoriale.
        ...(page === 'chi-siamo' ? { mainEntity: { '@id': `${SITE_URL}/#organization` } } : {}),
        ...(page === 'contatti' ? { about: { '@id': `${SITE_URL}/#organization` } } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: STATIC_PAGE_LABEL[page], item: url },
        ],
      },
    ],
  }
}

export function notFoundSeo(): SeoOptions {
  return {
    title: `Pagina non trovata (404) — ${SITE_NAME}`,
    description: 'La pagina richiesta non esiste o è stata spostata.',
  }
}

/** Conteggio parole del corpo dell'articolo (per wordCount in JSON-LD). */
function countWords(article: Article): number {
  let n = 0
  for (const b of article.blocks) {
    if ('text' in b && typeof b.text === 'string') n += b.text.split(/\s+/).filter(Boolean).length
    if (b.type === 'list') n += b.items.join(' ').split(/\s+/).filter(Boolean).length
    if (b.type === 'ranking') n += b.items.map((i) => i.text).join(' ').split(/\s+/).filter(Boolean).length
  }
  return n
}

export function articleSeo(article: Article): SeoOptions {
  const url = `${SITE_URL}${articleUrl(article)}`
  const og = `${SITE_URL}${ogImage(article)}`
  const ranking = article.blocks.find((b): b is Extract<ArticleBlock, { type: 'ranking' }> => b.type === 'ranking')
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    canonical: url,
    type: 'article',
    image: og,
    published: article.date,
    modified: article.updated,
    section: article.section,
    tags: article.tags,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        '@id': `${url}#article`,
        headline: article.title,
        description: article.metaDescription,
        image: [
          {
            '@type': 'ImageObject',
            url: og,
            width: 1200,
            height: 630,
            caption: article.title,
          },
          `${SITE_URL}${inlineImage(article)}`,
        ],
        datePublished: article.date,
        dateModified: article.updated,
        inLanguage: 'it-IT',
        articleSection: article.section,
        keywords: article.tags.join(', '),
        // Autore agganciato all'entità editoriale (stesso @id dell'Organization):
        // rafforza il legame articolo -> editore per la valutazione E-E-A-T.
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: article.author,
          url: `${SITE_URL}/chi-siamo`,
        },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        isAccessibleForFree: true,
        wordCount: countWords(article),
        abstract: article.answerBox,
        // AEO/voce: indica il blocco "In sintesi" come parte leggibile ad alta voce.
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-answer]'],
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: article.section, item: `${SITE_URL}/${article.sectionSlug}` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      // Dataset: ogni classifica ha un CSV riutilizzabile. È l'asset che
      // distingue questo sito dagli altri portali di settore (che pubblicano
      // solo testo) e lo rende citabile come FONTE DI DATI dai motori
      // generativi e da Google Dataset Search.
      ...(ranking
        ? [{
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            '@id': `${url}#dataset`,
            name: `${ranking.title} — dati in formato aperto`,
            description: `Dataset della classifica "${ranking.title}" pubblicata da Il Media Edile: ${ranking.items.length} voci con posizione, nome e valutazione redazionale. Riutilizzabile citando la fonte.`,
            url,
            license: 'https://creativecommons.org/licenses/by/4.0/',
            creator: { '@id': `${SITE_URL}/#organization` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'it-IT',
            datePublished: article.date,
            dateModified: article.updated,
            keywords: article.tags,
            isAccessibleForFree: true,
            measurementTechnique: 'Valutazione redazionale su qualità, assistenza in Italia, innovazione, sostenibilità e rapporto qualità-prezzo',
            variableMeasured: ['Posizione in classifica', 'Produttore o prodotto', 'Valutazione redazionale'],
            distribution: {
              '@type': 'DataDownload',
              encodingFormat: 'text/csv',
              contentUrl: `${SITE_URL}/downloads/${article.slug}-classifica.csv`,
            },
          }]
        : []),
      ...(ranking
        ? [{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: ranking.title,
            itemListOrder: 'https://schema.org/ItemListOrderDescending',
            numberOfItems: ranking.items.length,
            itemListElement: ranking.items.map((it) => ({
              '@type': 'ListItem',
              position: it.rank,
              name: it.name,
              description: it.text,
            })),
          }]
        : []),
    ],
  }
}

/** Dato un path, restituisce i metadati SEO della rotta (null se rotta sconosciuta). */
export function getSeoForPath(path: string): SeoOptions | null {
  const p = path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
  if (p === '/') return homeSeo()
  if (p === '/classifiche') return classificheSeo()
  if (p === '/produttori') return produttoriSeo()
  if (p === '/newsletter') return newsletterSeo()
  if (p === '/cerca') return searchSeo()
  const staticId = p.slice(1) as StaticPageId
  if (staticId in STATIC_PAGES) return staticPageSeo(staticId)
  const segs = p.slice(1).split('/')
  if (segs.length === 1) {
    const section = sections.find((s) => s.slug === segs[0])
    return section ? sectionSeo(section) : null
  }
  if (segs.length === 2) {
    const article = getArticle(segs[1])
    return article && article.sectionSlug === segs[0] ? articleSeo(article) : null
  }
  return null
}

/** Tutte le rotte pubbliche da pre-renderizzare in fase di build. */
export function produttoriSeo(): SeoOptions {
  const conSito = brands.filter((b) => b.url).length
  return {
    title: `Indice dei produttori edili: ${brands.length} marchi valutati | ${SITE_NAME}`,
    description: `I ${brands.length} produttori dell'edilizia italiana valutati nelle nostre classifiche, in un unico indice: settore, posizione ottenuta e classifica di riferimento per ciascun marchio.`,
    canonical: `${SITE_URL}/produttori`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Indice dei produttori — ${SITE_NAME}`,
        description: `Indice dei ${brands.length} marchi dell'edilizia valutati nelle classifiche de Il Media Edile, con settore, posizione e fonte. ${conSito} schede riportano il sito ufficiale.`,
        url: `${SITE_URL}/produttori`,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: brands.length,
          itemListElement: brands.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Organization',
              name: b.nome,
              ...(b.url ? { url: b.url } : {}),
            },
          })),
        },
      },
    ],
  }
}

export function getAllPrerenderPaths(): string[] {
  const paths: string[] = [
    '/',
    '/classifiche',
    '/produttori',
    '/newsletter',
    '/cerca',
    '/chi-siamo',
    '/contatti',
    '/privacy',
    '/cookie-policy',
  ]
  for (const s of sections) paths.push(`/${s.slug}`)
  for (const a of articles) paths.push(articleUrl(a))
  // NB: nessuna rotta /tag/. Erano 113 pagine noindex che formavano un grafo
  // chiuso (~12.900 link interni) e bruciavano il crawl budget di un dominio
  // nuovo, lasciando articoli e sezioni "rilevati ma non scansionati".
  return paths
}
