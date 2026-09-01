#!/usr/bin/env node
/**
 * Estrae i produttori citati nei blocchi `ranking` degli articoli e li
 * aggrega in src/data/brands.generated.ts.
 *
 * Nessun dato inventato: nome, sito ufficiale e descrizione provengono dalle
 * classifiche gia pubblicate, e ogni voce conserva l'articolo di origine con
 * la posizione ottenuta.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/articles')

const articles = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))

/** chiave di normalizzazione per accorpare lo stesso marchio */
const key = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')

const map = new Map()

for (const a of articles) {
  for (const b of a.blocks || []) {
    if (b.type !== 'ranking') continue
    for (const it of b.items || []) {
      if (!it?.name) continue
      const k = key(it.name)
      if (!map.has(k)) {
        map.set(k, { nome: it.name.trim(), url: it.url || '', sezioni: new Set(), voci: [] })
      }
      const e = map.get(k)
      if (!e.url && it.url) e.url = it.url
      if (a.section) e.sezioni.add(a.section)
      e.voci.push({
        rank: it.rank ?? 0,
        titolo: a.title,
        slug: a.slug,
        categorySlug: a.categorySlug,
        sezione: a.section || '',
        classifica: b.title || a.title,
        descrizione: (it.text || '').trim(),
      })
    }
  }
}

const brands = [...map.values()]
  .map((e) => ({
    nome: e.nome,
    url: e.url,
    sezioni: [...e.sezioni],
    // migliore posizione ottenuta, usata per l'ordinamento interno
    bestRank: Math.min(...e.voci.map((v) => v.rank || 99)),
    voci: e.voci.sort((x, y) => (x.rank || 99) - (y.rank || 99)),
  }))
  .sort((a, b) => a.nome.localeCompare(b.nome, 'it'))

const out = `// GENERATO da scripts/build-brands.mjs — non modificare a mano.
// Ogni marchio deriva dalle classifiche pubblicate e conserva le fonti.
export interface BrandVoce {
  rank: number
  titolo: string
  slug: string
  categorySlug: string
  sezione: string
  classifica: string
  descrizione: string
}

export interface Brand {
  nome: string
  url: string
  sezioni: string[]
  bestRank: number
  voci: BrandVoce[]
}

export const brands: Brand[] = ${JSON.stringify(brands, null, 2)}
`

writeFileSync(join(root, 'src/data/brands.generated.ts'), out)
console.log(
  `Indice produttori: ${brands.length} marchi da ${articles.filter((a) => (a.blocks || []).some((b) => b.type === 'ranking')).length} classifiche · ${brands.filter((b) => b.url).length} con sito ufficiale`
)
