import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { articles, SITE_NAME } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim()

  const results = useMemo(() => {
    if (!q) return []
    const terms = q.toLowerCase().split(/\s+/)
    return articles
      .map((a) => {
        const hay = `${a.title} ${a.answerBox} ${a.tags.join(' ')} ${a.category}`.toLowerCase()
        const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0)
        return { a, score }
      })
      .filter((r) => r.score > 0)
      .sort((x, y) => y.score - x.score)
      .map((r) => r.a)
  }, [q])

  useSeo({
    title: q ? `Ricerca: ${q} — ${SITE_NAME}` : `Cerca — ${SITE_NAME}`,
    description: `Risultati di ricerca su Il Media Edile per "${q}": notizie, classifiche e guide sull'edilizia.`,
  })

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8">
      <h1 className="font-headline text-3xl font-extrabold border-b-4 border-double border-neutral-800 pb-3">
        {q ? <>Risultati per “{q}”</> : 'Cerca nel sito'}
      </h1>
      <p className="mt-3 text-sm text-neutral-500">{results.length} articol{results.length === 1 ? 'o' : 'i'} trovat{results.length === 1 ? 'o' : 'i'}</p>
      <div className="mt-6">
        {results.map((a, i) => (
          <div key={a.slug}>
            <ArticleCard article={a} variant="list" />
            {(i + 1) % 5 === 0 && <AdSlot slot={`infeed-search-${i}`} format="infeed" className="my-6" />}
          </div>
        ))}
        {q && results.length === 0 && (
          <p className="py-10 text-neutral-600">Nessun risultato. Prova con termini più generici, ad esempio “serramenti”, “bonus” o “cantieri”.</p>
        )}
      </div>
    </main>
  )
}
