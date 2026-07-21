import { Link, useParams } from 'react-router'
import { sections, getBySection } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { sectionSeo } from '@/lib/seoData'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'
import { NewsletterBox } from '@/components/NewsletterBox'
import { ChevronRight } from 'lucide-react'

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const section = sections.find((s) => s.slug === categorySlug)

  if (!section) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-headline text-3xl font-extrabold">Sezione non trovata</h1>
        <p className="mt-4 text-neutral-600">La sezione richiesta non esiste.</p>
        <Link to="/" className="mt-6 inline-block text-[#0e9447] font-semibold hover:underline">Torna alla home page</Link>
      </main>
    )
  }

  const items = getBySection(section.slug)
  const featured = items[0]
  const rest = items.slice(1)

  useSeo(sectionSeo(section))

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      <nav aria-label="Percorso" className="text-xs text-neutral-500 flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-[#0e9447]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700 font-semibold" aria-current="page">{section.name}</span>
      </nav>

      <header className="border-b-2 pb-5 mb-8" style={{ borderColor: section.color }}>
        <span className="inline-block w-14 h-1.5 rounded-full mb-4" style={{ background: section.color }} />
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">{section.name}</h1>
        <p className="mt-3 text-neutral-600 max-w-3xl">{section.description}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {featured && (
            <article className="mb-8 border-b border-neutral-200 pb-8">
              <ArticleCard article={featured} variant="hero" />
            </article>
          )}
          <div>
            {rest.map((a, i) => (
              <div key={a.slug}>
                <ArticleCard article={a} variant="list" />
                {(i + 1) % 4 === 0 && <AdSlot slot={`infeed-${section.slug}-${i}`} format="infeed" className="my-6" />}
              </div>
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4 space-y-8" aria-label="Barra laterale">
          <div className="lg:sticky lg:top-32 space-y-8">
            <AdSlot slot={`mpu-${section.slug}`} format="rectangle" />
            <section aria-labelledby="other-sections" className="border-t-2 border-neutral-900 pt-4">
              <h2 id="other-sections" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">Le altre sezioni</h2>
              <ul className="space-y-3">
                {sections.filter((s) => s.slug !== section.slug).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/${s.slug}`} className="flex items-center justify-between group">
                      <span className="inline-flex items-center gap-2.5 font-headline font-bold group-hover:text-[#0e9447] transition-colors">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </span>
                      <span className="text-xs text-neutral-400">{getBySection(s.slug).length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <NewsletterBox />
          </div>
        </aside>
      </div>
    </main>
  )
}
