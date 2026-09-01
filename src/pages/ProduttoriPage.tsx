import { Link } from 'react-router'
import { brands } from '@/data/brands.generated'
import { useSeo } from '@/lib/seo'
import { produttoriSeo } from '@/lib/seoData'
import { AdSlot } from '@/components/AdSlot'
import { ChevronRight, Factory, ExternalLink } from 'lucide-react'

/** Iniziale usata per raggruppare l'indice (le cifre finiscono in "#"). */
const initial = (n: string) => {
  const c = n.trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

export default function ProduttoriPage() {
  useSeo(produttoriSeo())

  const letters = [...new Set(brands.map((b) => initial(b.nome)))].sort()
  const sezioni = [...new Set(brands.flatMap((b) => b.sezioni))].sort()
  const conSito = brands.filter((b) => b.url).length

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      <nav aria-label="Percorso" className="text-xs text-neutral-500 flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-[#0e9447]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700 font-semibold" aria-current="page">Produttori</span>
      </nav>

      <header className="border-b-2 border-neutral-900 pb-5 mb-4">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight inline-flex items-center gap-3">
          <Factory className="text-[#0e9447]" size={38} /> Indice dei produttori
        </h1>
        <p className="mt-3 text-neutral-600 max-w-3xl">
          I <strong>{brands.length} marchi</strong> valutati nelle nostre classifiche, raccolti in
          un unico indice: per ciascuno il settore di appartenenza, le classifiche in cui compare
          con la posizione ottenuta e il sito ufficiale. Un modo per partire dall'azienda invece
          che dalla categoria di prodotto.
        </p>
      </header>

      <section className="mb-8 max-w-3xl text-[0.95rem] leading-relaxed text-neutral-700">
        <p>
          L'indice è costruito sulle classifiche già pubblicate: nessun marchio vi compare a
          pagamento e nessuna posizione è in vendita. La valutazione resta quella dell'articolo di
          origine, con i criteri dichiarati caso per caso; qui trovi il rimando diretto all'analisi
          che l'ha prodotta. {conSito} schede riportano anche il sito ufficiale del produttore.
        </p>
        <p className="mt-3">
          Un'azienda può comparire in più classifiche quando opera su categorie diverse: in quel
          caso sono elencate tutte le presenze, ognuna con la propria posizione.
        </p>
      </section>

      <nav aria-label="Indice alfabetico" className="mb-8">
        <ul className="flex flex-wrap gap-1.5">
          {letters.map((l) => (
            <li key={l}>
              <a
                href={`#lettera-${l}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-[#0e9447] hover:text-[#0e9447]"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-neutral-500">
          Settori rappresentati: {sezioni.join(' · ')}
        </p>
      </nav>

      <div className="mx-auto max-w-7xl mb-8">
        <AdSlot slot="leaderboard-produttori" format="leaderboard" />
      </div>

      {letters.map((l, li) => (
        <section key={l} id={`lettera-${l}`} className="scroll-mt-24 mb-10">
          <h2 className="font-headline text-2xl font-extrabold border-b-2 border-[#0e9447] pb-1.5 mb-4">
            {l}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {brands
              .filter((b) => initial(b.nome) === l)
              .map((b) => (
                <article
                  key={b.nome}
                  className="rounded border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-headline text-lg font-bold text-neutral-900">{b.nome}</h3>
                    {b.url && (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-xs text-neutral-500 hover:text-[#0e9447]"
                      >
                        sito ufficiale <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-neutral-500">
                    {b.sezioni.join(' · ')}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {b.voci.map((v, i) => (
                      <li key={i} className="text-sm">
                        <span className="mr-1.5 inline-block min-w-[1.6rem] rounded bg-neutral-100 px-1.5 text-center text-xs font-bold text-neutral-700">
                          {v.rank ? `#${v.rank}` : '—'}
                        </span>
                        <Link
                          to={`/${v.categorySlug}/${v.slug}`}
                          className="text-neutral-700 hover:text-[#0e9447] hover:underline"
                        >
                          {v.classifica}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
          {li === 1 && (
            <div className="my-8">
              <AdSlot slot="infeed-produttori" format="infeed" />
            </div>
          )}
        </section>
      ))}
    </main>
  )
}
