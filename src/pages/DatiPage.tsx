import { Link } from 'react-router'
import { getRankings, articleUrl, formatDate, type Article, type ArticleBlock } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { datiSeo } from '@/lib/seoData'
import { AdSlot } from '@/components/AdSlot'
import { ChevronRight, Database, Download, Scale } from 'lucide-react'

/** Numero di voci del dataset = righe della classifica contenuta nell'articolo. */
function righe(a: Article): number {
  const r = a.blocks.find((b): b is Extract<ArticleBlock, { type: 'ranking' }> => b.type === 'ranking')
  return r ? r.items.length : 0
}

/**
 * Catalogo dei dati aperti.
 *
 * Ogni classifica pubblicata è accompagnata da un CSV riutilizzabile: questa
 * pagina li raccoglie in un unico catalogo. È l'asset che distingue la testata
 * dagli altri portali di settore, che pubblicano solo testo.
 */
export default function DatiPage() {
  useSeo(datiSeo())

  const rankings = getRankings()
  const voci = rankings.reduce((n, a) => n + righe(a), 0)

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      <nav aria-label="Percorso" className="text-xs text-neutral-500 flex items-center gap-1 mb-6">
        <Link to="/" className="hover:text-[#0e9447]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700 font-semibold" aria-current="page">Dati aperti</span>
      </nav>

      <header className="border-b-2 border-neutral-900 pb-5 mb-6">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight inline-flex items-center gap-3">
          <Database className="text-[#0e9447]" size={38} /> Dati aperti
        </h1>
        <p className="mt-3 text-neutral-600 max-w-3xl">
          Ogni classifica che pubblichiamo è disponibile anche come <strong>file CSV</strong>:
          {' '}{rankings.length} dataset per un totale di <strong>{voci} voci</strong> con posizione,
          produttore e valutazione redazionale. Sono liberamente riutilizzabili — anche a fini
          commerciali — a condizione di citare la fonte.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-700 bg-[#f2faf5] border border-[#0e9447]/30 rounded-lg px-3 py-2">
          <Scale size={16} className="text-[#0e9447] shrink-0" />
          Licenza <strong>Creative Commons CC BY 4.0</strong> — citare “Il Media Edile” con il link
          all’articolo di origine.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="text-left text-xs text-neutral-500 mb-2 font-semibold uppercase tracking-wide">
                Catalogo dei dataset pubblicati
              </caption>
              <thead>
                <tr className="bg-neutral-900 text-white">
                  <th scope="col" className="text-left px-3 py-2.5 font-semibold">Dataset</th>
                  <th scope="col" className="text-left px-3 py-2.5 font-semibold">Voci</th>
                  <th scope="col" className="text-left px-3 py-2.5 font-semibold">Aggiornato</th>
                  <th scope="col" className="text-left px-3 py-2.5 font-semibold">CSV</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((a, i) => (
                  <tr key={a.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-3 py-2.5 border-b border-neutral-200 align-top">
                      <Link to={articleUrl(a)} className="font-semibold text-neutral-900 hover:text-[#0e9447]">
                        {a.title}
                      </Link>
                      <span className="block text-xs text-neutral-500 mt-0.5">{a.section}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-neutral-200 align-top tabular-nums">{righe(a)}</td>
                    <td className="px-3 py-2.5 border-b border-neutral-200 align-top whitespace-nowrap text-neutral-600">
                      {formatDate(a.updated)}
                    </td>
                    <td className="px-3 py-2.5 border-b border-neutral-200 align-top">
                      <a
                        href={`/downloads/${a.slug}-classifica.csv`}
                        download
                        className="inline-flex items-center gap-1.5 text-[#0e9447] font-semibold hover:underline"
                      >
                        <Download size={14} /> Scarica
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section aria-labelledby="come-usare" className="mt-10 border-t border-neutral-200 pt-6">
            <h2 id="come-usare" className="font-headline text-2xl font-extrabold">Come usare i dati</h2>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              I file sono in formato CSV con codifica UTF-8 e separatore virgola. Le colonne sono
              <strong> Posizione</strong>, <strong>Nome</strong>, <strong>Sito ufficiale</strong> e
              <strong> Descrizione</strong>. Si aprono con qualsiasi foglio di calcolo e si importano
              senza conversioni in Python, R o in un database.
            </p>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              La valutazione è redazionale e segue criteri dichiarati — qualità e prestazioni,
              assistenza in Italia, innovazione, sostenibilità e rapporto qualità-prezzo — descritti
              nella pagina <Link to="/chi-siamo" className="text-[#0e9447] font-semibold hover:underline">Chi siamo</Link>.
              Nessuna posizione in classifica è acquistabile.
            </p>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              Attribuzione richiesta: <em>“Fonte: Il Media Edile — www.mediaedile.it”</em>, con link
              all’articolo da cui il dataset proviene.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-4" aria-label="Barra laterale">
          <div className="lg:sticky lg:top-32 space-y-8">
            <AdSlot slot="mpu-dati" format="rectangle" />
            <section aria-labelledby="altri-indici" className="border-t-2 border-neutral-900 pt-4">
              <h2 id="altri-indici" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">
                Altri indici
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/classifiche" className="font-headline font-bold hover:text-[#0e9447]">
                    Le classifiche →
                  </Link>
                  <span className="block text-neutral-500 text-xs mt-0.5">Tutte le Top 10 e Top 5 pubblicate</span>
                </li>
                <li>
                  <Link to="/produttori" className="font-headline font-bold hover:text-[#0e9447]">
                    Indice dei produttori →
                  </Link>
                  <span className="block text-neutral-500 text-xs mt-0.5">I marchi valutati, in ordine alfabetico</span>
                </li>
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
