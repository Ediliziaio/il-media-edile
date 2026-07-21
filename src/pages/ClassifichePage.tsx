import { Link } from 'react-router'
import { getRankings, heroImage, articleUrl } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { classificheSeo } from '@/lib/seoData'
import { AdSlot } from '@/components/AdSlot'
import { NewsletterBox } from '@/components/NewsletterBox'
import { ChevronRight, Trophy } from 'lucide-react'

export default function ClassifichePage() {
  const rankings = getRankings()
  const top10 = rankings.filter((a) => a.categorySlug === 'top-10')
  const top5 = rankings.filter((a) => a.categorySlug === 'top-5')

  useSeo(classificheSeo())

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      <nav aria-label="Percorso" className="text-xs text-neutral-500 flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-[#0e9447]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700 font-semibold" aria-current="page">Classifiche</span>
      </nav>

      <header className="border-b-2 border-neutral-900 pb-5 mb-4">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight inline-flex items-center gap-3">
          <Trophy className="text-[#0e9447]" size={38} /> Le Classifiche
        </h1>
        <p className="mt-3 text-neutral-600 max-w-3xl">
          Le selezioni della redazione: i migliori produttori, prodotti e strumenti dell'edilizia italiana,
          valutati su qualità, innovazione, rete di assistenza, sostenibilità e rapporto qualità-prezzo.
          Classifiche redazionali e indipendenti: nessuna posizione è in vendita.
        </p>
      </header>

      <div className="mx-auto max-w-7xl mb-8">
        <AdSlot slot="leaderboard-classifiche" format="leaderboard" />
      </div>

      <RankingGroup title="Top 10" subtitle="Le dieci eccellenze per ogni categoria" items={top10} />
      <div className="my-10"><AdSlot slot="infeed-classifiche" format="infeed" /></div>
      <RankingGroup title="Top 5" subtitle="Le selezioni essenziali, cinque nomi per scegliere in fretta" items={top5} />

      <div className="mt-12 max-w-2xl">
        <NewsletterBox />
      </div>
    </main>
  )
}

function RankingGroup({ title, subtitle, items }: { title: string; subtitle: string; items: ReturnType<typeof getRankings> }) {
  return (
    <section aria-labelledby={`group-${title.replace(' ', '-')}`} className="mt-10">
      <h2 id={`group-${title.replace(' ', '-')}`} className="font-headline text-2xl md:text-3xl font-extrabold">{title}</h2>
      <p className="text-sm text-neutral-500 mt-1 mb-6">{subtitle}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => (
          <Link key={a.slug} to={articleUrl(a)} className="group border border-neutral-200 rounded-xl overflow-hidden hover:border-[#0e9447] hover:shadow-md transition-all">
            <img
              src={heroImage(a)}
              alt={a.title}
              width={1200}
              height={630}
              loading="lazy"
              className="w-full aspect-[1200/630] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0e9447]">{a.section}</span>
              <h3 className="font-headline font-bold leading-snug mt-1.5 group-hover:text-[#0e9447] transition-colors line-clamp-2">
                {a.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
