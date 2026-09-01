import { Link } from 'react-router'
import { articles, getBySection, getRankings, sections, heroImage } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { homeSeo } from '@/lib/seoData'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'
import { NewsletterBox } from '@/components/NewsletterBox'
import { ArrowRight, Trophy } from 'lucide-react'

export default function Home() {
  const heroPool = [...articles].sort((a, b) => (a.categorySlug === 'news' ? -1 : 1) - (b.categorySlug === 'news' ? -1 : 1))
  const hero = heroPool[0]
  const secondary = articles.filter((a) => a.slug !== hero?.slug).slice(0, 4)
  const rankings = getRankings()
  const mostRead = articles.slice(0, 7)

  useSeo(homeSeo())

  return (
    <main>
      {/* H1 unico della home: definisce l'entità della testata per i motori.
          sr-only per non competere con il masthead grafico dell'Header. */}
      <h1 className="sr-only">
        Il Media Edile — classifiche indipendenti e confronti dei migliori produttori
        e prodotti dell'edilizia italiana, con dati scaricabili
      </h1>

      {/* Leaderboard top */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <AdSlot slot="leaderboard-top" format="leaderboard" />
      </div>

      {/* Apertura */}
      <div className="mx-auto max-w-7xl px-4 mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {hero && <ArticleCard article={hero} variant="hero" />}
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8 mt-8 pt-8 border-t border-neutral-200">
            {secondary.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="large" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8" aria-label="Barra laterale">
          <AdSlot slot="mpu-1" format="rectangle" />
          <section aria-labelledby="mostread" className="border-t-2 border-neutral-900 pt-4">
            <h2 id="mostread" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">I più letti</h2>
            <ol className="space-y-4">
              {mostRead.map((a, i) => (
                <li key={a.slug}>
                  <ArticleCard article={a} variant="compact" rank={i + 1} />
                </li>
              ))}
            </ol>
          </section>
          <AdSlot slot="halfpage-home" format="halfpage" />
        </aside>
      </div>

      {/* Band classifiche */}
      <section aria-labelledby="classifiche" className="mt-12 bg-neutral-950 text-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <header className="flex items-baseline justify-between mb-6">
            <h2 id="classifiche" className="font-headline text-2xl md:text-3xl font-extrabold inline-flex items-center gap-3">
              <Trophy className="text-[#35c06f]" size={26} /> Le Classifiche
            </h2>
            <span className="text-sm text-neutral-400">
              {rankings.length} classifiche · criteri dichiarati · dati scaricabili in CSV
            </span>
          </header>
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none snap-x">
            {rankings.slice(0, 8).map((a) => (
              <div key={a.slug} className="w-72 shrink-0 snap-start">
                <Link to={`/${a.sectionSlug}/${a.slug}`} className="block overflow-hidden rounded-lg">
                  <img
                    src={heroImage(a)}
                    alt={a.title}
                    width={1600}
                    height={900}
                    loading="lazy"
                    className="w-full aspect-video object-cover hover:scale-[1.03] transition-transform duration-500"
                  />
                </Link>
                <span className="inline-block mt-2.5 text-[11px] font-bold uppercase tracking-wider text-[#35c06f]">
                  {a.category}
                </span>
                <Link to={`/${a.sectionSlug}/${a.slug}`}>
                  <h3 className="font-headline font-bold leading-snug mt-1 hover:text-[#35c06f] transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner intermedio */}
      <div className="mx-auto max-w-7xl px-4 mt-10">
        <AdSlot slot="billboard-mid" format="billboard" />
      </div>

      {/* News + sidebar newsletter */}
      <div className="mx-auto max-w-7xl px-4 mt-12 grid gap-10 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-labelledby="news-section">
          <SectionHeader id="news-section" title="News" slug="news" color="#c0392b" />
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
            {getBySection('news').slice(0, 4).map((a, idx) => (
              <div key={a.slug}>
                <ArticleCard article={a} variant="large" />
                {idx === 1 && <AdSlot slot="infeed-news" format="infeed" className="mt-6" />}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-200 grid sm:grid-cols-2 gap-x-6 gap-y-8">
            {getBySection('norme-bonus').map((a) => (
              <ArticleCard key={a.slug} article={a} variant="large" />
            ))}
          </div>
        </section>
        <aside className="lg:col-span-4 space-y-8">
          <NewsletterBox />
          <AdSlot slot="mpu-2" format="rectangle" />
          <section aria-labelledby="sezioni-side" className="border-t-2 border-neutral-900 pt-4">
            <h2 id="sezioni-side" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">Esplora le sezioni</h2>
            <ul className="space-y-3">
              {sections.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="flex items-center justify-between group">
                    <span className="inline-flex items-center gap-2.5 font-semibold group-hover:text-[#0e9447] transition-colors">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="text-xs text-neutral-400">{getBySection(s.slug).length} articoli</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* Sezioni tematiche */}
      <SectionBlock slug="materiali-prodotti" />
      <SectionBlock slug="mercato" invert />
      <SectionBlock slug="impianti" />

      {/* Tutti gli articoli */}
      <div className="mx-auto max-w-7xl px-4 mt-12">
        <header className="border-b-2 border-neutral-900 pb-2 mb-6">
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold">Tutti gli articoli</h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {articles.slice(5).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </main>
  )
}

function SectionHeader({ id, title, slug, color }: { id: string; title: string; slug: string; color: string }) {
  return (
    <header className="flex items-baseline justify-between border-b-2 pb-2 mb-6" style={{ borderColor: color }}>
      <h2 id={id} className="font-headline text-2xl md:text-3xl font-extrabold">{title}</h2>
      <Link to={`/${slug}`} className="text-sm font-semibold hover:underline inline-flex items-center gap-1" style={{ color }}>
        Tutti gli articoli <ArrowRight size={14} />
      </Link>
    </header>
  )
}

function SectionBlock({ slug, invert }: { slug: string; invert?: boolean }) {
  const section = sections.find((s) => s.slug === slug)!
  const items = getBySection(slug).slice(0, 4)
  return (
    <section aria-labelledby={`section-${slug}`} className={`mt-12 py-10 ${invert ? 'bg-neutral-100' : 'bg-white border-y border-neutral-200'}`}>
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader id={`section-${slug}`} title={section.name} slug={slug} color={section.color} />
        <p className="text-sm text-neutral-500 mb-6 max-w-3xl -mt-3">{section.description}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="large" />
          ))}
        </div>
      </div>
    </section>
  )
}
