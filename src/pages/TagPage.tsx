import { Link, useParams } from 'react-router'
import { getByTag, getAllTags, tagSlug, tagFromSlug } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { tagSeo } from '@/lib/seoData'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'
import { ChevronRight, Tag } from 'lucide-react'
import NotFound from './NotFound'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  // Il segmento URL è uno slug (es. "bonus-edilizi"): risolvi al tag originale.
  const decoded = tagFromSlug(tag ?? '')

  // Tag inesistente: pagina 404 unica del sito.
  if (!decoded) return <NotFound />

  const items = getByTag(decoded)
  const allTags = getAllTags()

  useSeo(tagSeo(decoded))

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      <nav aria-label="Percorso" className="text-xs text-neutral-500 flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-[#0e9447]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700 font-semibold" aria-current="page">#{decoded}</span>
      </nav>

      <header className="border-b-2 border-neutral-900 pb-5 mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight inline-flex items-center gap-3">
          <Tag className="text-[#0e9447]" size={34} /> {decoded}
        </h1>
        <p className="mt-3 text-neutral-600">{items.length} articol{items.length === 1 ? 'o' : 'i'} su questo argomento</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {items.length === 0 && (
            <p className="py-10 text-neutral-600">Nessun articolo con questo tag. Esplora gli argomenti più trattati qui accanto.</p>
          )}
          {items.map((a, i) => (
            <div key={a.slug}>
              <ArticleCard article={a} variant="list" />
              {(i + 1) % 4 === 0 && <AdSlot slot={`infeed-tag-${i}`} format="infeed" className="my-6" />}
            </div>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-8">
            <AdSlot slot="mpu-tag" format="rectangle" />
            <section aria-labelledby="all-tags" className="border-t-2 border-neutral-900 pt-4">
              <h2 id="all-tags" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">Tutti gli argomenti</h2>
              <div className="flex flex-wrap gap-2">
                {allTags.map(({ tag: t, count }) => (
                  <Link
                    key={t}
                    to={`/tag/${tagSlug(t)}`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      t === decoded
                        ? 'bg-[#0e9447] text-white border-[#0e9447]'
                        : 'border-neutral-200 text-neutral-600 hover:border-[#0e9447] hover:text-[#0e9447]'
                    }`}
                  >
                    #{t} <span className="opacity-60">({count})</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
