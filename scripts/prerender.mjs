// Pre-rendering statico di tutte le rotte pubbliche.
// Eseguito dopo `vite build` (client) e `vite build --ssr` (server bundle):
// 1. importa il bundle SSR da dist/server/entry-server.js
// 2. per ogni rotta: renderizza l'App in HTML (renderToString)
// 3. inietta nel template dist/index.html l'HTML della pagina e i meta SEO
//    (title, description, canonical, Open Graph, Twitter, article:*, JSON-LD)
// 4. scrive dist/<rotta>/index.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const { render, getAllPrerenderPaths, getSeoForPath } = await import(
  pathToFileURL(join(dist, 'server', 'entry-server.js')).href
)

// --- escape helpers -------------------------------------------------------
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => escText(s).replace(/"/g, '&quot;')

function replaceOnce(html, pattern, replacement, label) {
  if (typeof pattern === 'string') {
    if (!html.includes(pattern)) throw new Error(`[prerender] tag non trovato nel template: ${label}`)
    return html.replace(pattern, replacement)
  }
  if (!pattern.test(html)) throw new Error(`[prerender] tag non trovato nel template: ${label}`)
  return html.replace(pattern, replacement)
}

function setMeta(html, attr, key, content) {
  return replaceOnce(
    html,
    new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`),
    `<meta ${attr}="${key}" content="${escAttr(content)}" />`,
    `meta[${attr}="${key}"]`,
  )
}

// --- head per-pagina ------------------------------------------------------
function applySeo(html, seo) {
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escText(seo.title)}</title>`, 'title')
  html = setMeta(html, 'name', 'description', seo.description)
  if (seo.canonical) {
    html = replaceOnce(
      html,
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escAttr(seo.canonical)}" />`,
      'canonical',
    )
    html = setMeta(html, 'property', 'og:url', seo.canonical)
  }
  html = setMeta(html, 'property', 'og:title', seo.title)
  html = setMeta(html, 'property', 'og:description', seo.description)
  html = setMeta(html, 'property', 'og:type', seo.type ?? 'website')
  if (seo.image) html = setMeta(html, 'property', 'og:image', seo.image)
  html = setMeta(html, 'name', 'twitter:title', seo.title)
  html = setMeta(html, 'name', 'twitter:description', seo.description)
  if (seo.image) html = setMeta(html, 'name', 'twitter:image', seo.image)

  const extra = []
  if (seo.published) extra.push(`<meta property="article:published_time" content="${escAttr(seo.published)}" />`)
  if (seo.modified) extra.push(`<meta property="article:modified_time" content="${escAttr(seo.modified)}" />`)
  if (seo.section) extra.push(`<meta property="article:section" content="${escAttr(seo.section)}" />`)
  for (const t of seo.tags ?? []) extra.push(`<meta property="article:tag" content="${escAttr(t)}" />`)
  if (seo.jsonLd) {
    // id="page-jsonld": il client (useSeo) lo sostituisce all'idratazione
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    extra.push(`<script type="application/ld+json" id="page-jsonld">${json}</script>`)
  }
  if (extra.length) html = html.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`)
  return html
}

// --- rendering di tutte le rotte ------------------------------------------
const paths = getAllPrerenderPaths()
let written = 0
const failed = []

for (const path of paths) {
  try {
    const seo = getSeoForPath(path)
    if (!seo) throw new Error('nessun dato SEO per la rotta')
    const appHtml = render(path)
    if (!appHtml || appHtml.length < 200) throw new Error('render sospettosamente corto')

    let html = applySeo(template, seo)
    html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${appHtml}</div>`, '#root')

    const outFile = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
    mkdirSync(dirname(outFile), { recursive: true })
    writeFileSync(outFile, html)
    written++
  } catch (err) {
    failed.push(`${path}: ${err.message}`)
  }
}

console.log(`[prerender] ${written}/${paths.length} rotte pre-renderizzate`)
if (failed.length) {
  console.error('[prerender] rotte fallite:\n  ' + failed.join('\n  '))
  process.exit(1)
}
