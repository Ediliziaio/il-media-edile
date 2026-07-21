// Sorgente unica dei metadati SEO per pagina.
// Usata sia dalle pagine (via useSeo) sia dallo script di prerender
// (scripts/prerender.mjs) per iniettare title/meta/canonical/JSON-LD
// nell'HTML statico di ogni rotta.
import {
  articles,
  sections,
  getArticle,
  getAllTags,
  getBySection,
  getRankings,
  articleUrl,
  heroImage,
  inlineImage,
  SITE_URL,
  SITE_NAME,
  type Article,
  type ArticleBlock,
} from './articles'
import type { SeoOptions } from './seo'

export type Section = (typeof sections)[number]
export type StaticPageId = 'chi-siamo' | 'contatti' | 'privacy' | 'cookie-policy'

export function homeSeo(): SeoOptions {
  return {
    title: 'Il Media Edile — Notizie, guide e classifiche sull’edilizia italiana',
    description: 'Il blog dell’edilizia italiana: news di settore, norme e bonus, mercato, materiali, impianti, innovazione BIM e classifiche dei migliori produttori di serramenti, impianti e finiture.',
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
    title: `Le Classifiche — Top 10 e Top 5 dell'edilizia | ${SITE_NAME}`,
    description: 'Tutte le classifiche de Il Media Edile: le Top 10 e le Top 5 dei migliori produttori di serramenti, impianti, materiali, software BIM e macchine da cantiere, selezionate dalla redazione.',
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

export function tagSeo(tag: string): SeoOptions {
  return {
    title: `#${tag} — articoli e guide | ${SITE_NAME}`,
    description: `Tutti gli articoli de Il Media Edile su "${tag}": news, guide e classifiche del settore edile aggiornate dalla redazione.`,
    canonical: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `#${tag} — ${SITE_NAME}`,
      url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
      inLanguage: 'it-IT',
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
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
  }
}

const STATIC_PAGES: Record<StaticPageId, { title: string; description: string }> = {
  'chi-siamo': {
    title: `Chi siamo — ${SITE_NAME}`,
    description: 'Il Media Edile è il quotidiano online dell’edilizia italiana: redazione, missione e linea editoriale della testata.',
  },
  contatti: {
    title: `Contatti e pubblicità — ${SITE_NAME}`,
    description: 'Come contattare la redazione de Il Media Edile e richiedere informazioni sugli spazi pubblicitari della testata.',
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

export function staticPageSeo(page: StaticPageId): SeoOptions {
  const c = STATIC_PAGES[page]
  return { title: c.title, description: c.description, canonical: `${SITE_URL}/${page}` }
}

export function articleSeo(article: Article): SeoOptions {
  const url = `${SITE_URL}${articleUrl(article)}`
  const hero = `${SITE_URL}${heroImage(article)}`
  const ranking = article.blocks.find((b): b is Extract<ArticleBlock, { type: 'ranking' }> => b.type === 'ranking')
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    canonical: url,
    type: 'article',
    image: hero,
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
            url: hero,
            width: 2048,
            height: 1152,
            caption: article.title,
          },
          `${SITE_URL}${inlineImage(article)}`,
        ],
        datePublished: article.date,
        dateModified: article.updated,
        inLanguage: 'it-IT',
        articleSection: article.section,
        keywords: article.tags.join(', '),
        author: { '@type': 'Organization', name: article.author, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        isPartOf: { '@id': `${SITE_URL}/#website` },
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
  if (p === '/newsletter') return newsletterSeo()
  if (p === '/cerca') return searchSeo()
  const staticId = p.slice(1) as StaticPageId
  if (staticId in STATIC_PAGES) return staticPageSeo(staticId)
  const tagMatch = p.match(/^\/tag\/(.+)$/)
  if (tagMatch) return tagSeo(decodeURIComponent(tagMatch[1]))
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
export function getAllPrerenderPaths(): string[] {
  const paths: string[] = [
    '/',
    '/classifiche',
    '/newsletter',
    '/cerca',
    '/chi-siamo',
    '/contatti',
    '/privacy',
    '/cookie-policy',
  ]
  for (const s of sections) paths.push(`/${s.slug}`)
  for (const a of articles) paths.push(articleUrl(a))
  for (const { tag } of getAllTags()) paths.push(`/tag/${encodeURIComponent(tag)}`)
  return paths
}
