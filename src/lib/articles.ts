// Loader e tipi per gli articoli de Il Media Edile

export interface RankingItem {
  rank: number
  name: string
  url?: string
  text: string
}

export type ArticleBlock =
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ranking'; title: string; items: RankingItem[] }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'quote'; text: string; source?: string }

export interface Faq {
  q: string
  a: string
}

export interface Article {
  slug: string
  title: string
  seoTitle: string
  metaDescription: string
  category: string       // formato: Top 10 / Top 5 / News
  categorySlug: string
  section: string        // sezione tematica del blog (menu)
  sectionSlug: string
  tags: string[]
  author: string
  date: string
  updated: string
  readTime: number
  answerBox: string
  blocks: ArticleBlock[]
  faq: Faq[]
}

const modules = import.meta.glob<{ default: Article }>('../articles/*.json', { eager: true })

export const articles: Article[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => b.date.localeCompare(a.date))

export const SITE_URL = 'https://www.mediaedile.it'
export const SITE_NAME = 'Il Media Edile'

/** Sezioni tematiche del blog (menu principale) */
export const sections = [
  { slug: 'news', name: 'News', color: '#c0392b', description: 'Attualità, cantieri, eventi e protagonisti: il polso quotidiano del settore delle costruzioni in Italia.' },
  { slug: 'norme-bonus', name: 'Norme e Bonus', color: '#0e9447', description: 'Superbonus, incentivi, sicurezza in cantiere e normativa: cosa cambia per imprese, professionisti e privati.' },
  { slug: 'mercato', name: 'Mercato e Imprese', color: '#1f4e79', description: 'Prezzi dei materiali, mercato immobiliare, grandi imprese e occupazione: i numeri dell\u2019edilizia italiana.' },
  { slug: 'materiali-prodotti', name: 'Materiali e Prodotti', color: '#b7791f', description: 'Serramenti, ceramiche, porte, parquet, coperture e vernici: guide e classifiche dei migliori produttori.' },
  { slug: 'impianti', name: 'Impianti ed Efficienza', color: '#0e7490', description: 'Fotovoltaico, pompe di calore, caldaie e ascensori: le tecnologie per l\u2019efficienza energetica degli edifici.' },
  { slug: 'innovazione', name: 'Innovazione e BIM', color: '#6d28d9', description: 'BIM, software, domotica e digitalizzazione del cantiere: l\u2019edilizia che cambia.' },
  { slug: 'sostenibilita', name: 'Sostenibilità', color: '#15803d', description: 'Direttiva Case Green, certificazioni ambientali, isolanti e bioedilizia: costruire in modo sostenibile.' },
]

export const sectionColors: Record<string, string> = Object.fromEntries(sections.map((s) => [s.slug, s.color]))

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getBySection(sectionSlug: string): Article[] {
  return articles.filter((a) => a.sectionSlug === sectionSlug)
}

export function getRankings(): Article[] {
  return articles.filter((a) => a.categorySlug === 'top-10' || a.categorySlug === 'top-5')
}

export function getRelated(article: Article, count = 4): Article[] {
  const same = articles.filter((a) => a.slug !== article.slug && a.sectionSlug === article.sectionSlug)
  const others = articles.filter((a) => a.slug !== article.slug && a.sectionSlug !== article.sectionSlug)
  return [...same, ...others].slice(0, count)
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre']
  return `${d} ${months[m - 1]} ${y}`
}

/** Rende inline **grassetto** e [link](url) come HTML sicuro */
export function renderInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0e9447] font-semibold underline decoration-[#0e9447]/40 underline-offset-2 hover:decoration-[#0e9447]">$1</a>')
}

export function articleUrl(a: Article): string {
  return `/${a.sectionSlug}/${a.slug}`
}

/** Immagine di copertina visibile (hero in pagina): WebP leggero per l'LCP. */
export function heroImage(a: Article): string {
  return `/images/${a.slug}-photo.webp`
}

/** Immagine per Open Graph / Twitter / JSON-LD: JPG 1200×630, compatibile ovunque. */
export function ogImage(a: Article): string {
  return `/images/${a.slug}-og.jpg`
}

export function inlineImage(a: Article): string {
  return `/images/${a.slug}-inline.png`
}

// NB: le pagine /tag sono state rimosse (archivi sottili, 113 URL noindex che
// consumavano il crawl budget). I tag restano metadata dell'articolo: mostrati
// come testo e usati in JSON-LD "keywords".
