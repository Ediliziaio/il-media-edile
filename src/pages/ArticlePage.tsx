import { Link, useParams } from 'react-router'
import { getArticle, getRelated, formatDate, renderInline, heroImage, inlineImage, sectionColors, tagSlug, SITE_NAME, type ArticleBlock } from '@/lib/articles'
import { useSeo } from '@/lib/seo'
import { articleSeo } from '@/lib/seoData'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'
import { NewsletterBox } from '@/components/NewsletterBox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Clock, ChevronRight, Tag, User, CalendarDays, ListOrdered, ExternalLink, Download } from 'lucide-react'
import NotFound from './NotFound'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticle(slug) : undefined

  // Articolo inesistente: pagina 404 unica del sito (coerente col 404.html
  // servito da Vercel → nessun mismatch d'idratazione).
  if (!article) return <NotFound />

  const color = sectionColors[article.sectionSlug] ?? '#0e9447'
  const toc = article.blocks.filter((b): b is Extract<ArticleBlock, { type: 'h2' }> => b.type === 'h2')
  const ranking = article.blocks.find((b): b is Extract<ArticleBlock, { type: 'ranking' }> => b.type === 'ranking')
  useSeo(articleSeo(article))

  const related = getRelated(article)

  return (
    <main>
      <article itemScope itemType="https://schema.org/NewsArticle" className="mx-auto max-w-7xl px-4 pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Percorso" className="text-xs text-neutral-500 flex flex-wrap items-center gap-1 mb-6">
          <Link to="/" className="hover:text-[#0e9447]">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/${article.sectionSlug}`} className="hover:text-[#0e9447] font-semibold">{article.section}</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-700 line-clamp-1" aria-current="page">{article.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Corpo articolo */}
          <div className="lg:col-span-8">
            <div>
              <span
                className="inline-block text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
                style={{ background: color }}
                itemProp="articleSection"
              >
                {article.section}
              </span>
              {article.categorySlug !== 'news' && (
                <span className="inline-block bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ml-1.5">
                  {article.category}
                </span>
              )}
            </div>
            <h1 itemProp="headline" className="font-headline text-3xl md:text-[2.6rem] md:leading-[1.15] font-extrabold tracking-tight mt-3">
              {article.title}
            </h1>

            {/* Answer box — AEO / featured snippet */}
            <div className="mt-5 border-l-4 bg-[#f2faf5] p-4 md:p-5 rounded-r-lg" style={{ borderColor: color }} data-answer>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color }}>In sintesi</p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-800" itemProp="description">
                {article.answerBox}
              </p>
            </div>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 border-y border-neutral-200 py-3">
              <span className="inline-flex items-center gap-1.5" itemProp="author" itemScope itemType="https://schema.org/Organization">
                <User size={13} /> <span itemProp="name" className="font-semibold text-neutral-700">{article.author}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} />
                <time itemProp="datePublished" dateTime={article.date}>{formatDate(article.date)}</time>
                <meta itemProp="dateModified" content={article.updated} />
              </span>
              <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {article.readTime} min di lettura</span>
            </div>

            {/* Immagine di copertina */}
            <figure className="mt-6">
              <img
                src={heroImage(article)}
                alt={article.title}
                width={1600}
                height={825}
                fetchPriority="high"
                decoding="async"
                itemProp="image"
                className="w-full aspect-video object-cover rounded-xl"
              />
              <figcaption className="mt-2 text-xs text-neutral-400">
                {article.title} — immagine de Il Media Edile
              </figcaption>
            </figure>

            {/* Indice — anchor links (sitelinks) */}
            {toc.length > 0 && (
              <nav aria-label="Indice dell'articolo" className="mt-6 border border-neutral-200 bg-neutral-50 rounded-xl p-4 md:p-5">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-800 mb-2">
                  <ListOrdered size={16} /> Indice dei contenuti
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-[#0e9447] hover:underline">{h.text}</a>
                    </li>
                  ))}
                  <li><a href="#faq" className="text-[#0e9447] hover:underline">Domande frequenti (FAQ)</a></li>
                </ol>
              </nav>
            )}

            {/* Download CSV della classifica */}
            {ranking && (
              <div className="mt-6 flex items-center gap-3 border border-dashed border-[#0e9447]/50 bg-[#f2faf5] rounded-xl px-4 py-3">
                <Download size={18} className="text-[#0e9447] shrink-0" />
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Dati aperti:</span> questa classifica è disponibile anche in formato CSV, riutilizzabile citando la fonte.{' '}
                  <a
                    href={`/downloads/${article.slug}-classifica.csv`}
                    download
                    className="text-[#0e9447] font-semibold underline underline-offset-2 hover:no-underline"
                  >
                    Scarica il CSV
                  </a>
                </p>
              </div>
            )}

            {/* Blocchi con infografica e annunci in-article */}
            <div itemProp="articleBody" className="mt-8 space-y-6">
              {article.blocks.map((b, i) => (
                <div key={i}>
                  <BlockRenderer block={b} index={i} />
                  {i === 1 && (
                    <figure className="my-2">
                      <img
                        src={inlineImage(article)}
                        alt={`Infografica: ${article.title}`}
                        width={1200}
                        height={675}
                        loading="lazy"
                        className="w-full aspect-[1200/675] object-cover rounded-xl border border-neutral-200"
                      />
                      <figcaption className="mt-2 text-xs text-neutral-400">
                        Infografica a cura della redazione de Il Media Edile
                      </figcaption>
                    </figure>
                  )}
                </div>
              ))}
            </div>

            {/* Tag */}
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-5">
              <Tag size={14} className="text-neutral-500" />
              {article.tags.map((t) => (
                <Link
                  key={t}
                  to={`/tag/${tagSlug(t)}`}
                  className="text-xs bg-neutral-100 hover:bg-[#0e9447] hover:text-white text-neutral-700 px-3 py-1 rounded-full transition-colors"
                  itemProp="keywords"
                >
                  #{t}
                </Link>
              ))}
            </div>

            {/* FAQ — AEO */}
            <section id="faq" aria-labelledby="faq-title" className="mt-10 border-t-2 border-neutral-900 pt-6">
              <h2 id="faq-title" className="font-headline text-2xl font-extrabold mb-4">Domande frequenti</h2>
              <Accordion type="single" collapsible className="w-full">
                {article.faq.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent forceMount className="text-neutral-700 leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Autore / E-E-A-T */}
            <section aria-label="Informazioni sull'autore" className="mt-10 bg-neutral-100 rounded-xl p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#0e9447] text-white flex items-center justify-center font-headline font-extrabold text-lg shrink-0">ME</div>
              <div>
                <p className="font-bold text-sm">{article.author}</p>
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                  La redazione de Il Media Edile segue ogni giorno cantieri, aziende e normative del settore costruzioni,
                  con l'obiettivo di offrire a imprese e professionisti informazione verificata, classifiche indipendenti
                  e guide pratiche sempre aggiornate.
                </p>
              </div>
            </section>

            <div className="mt-10">
              <AdSlot slot="in-article-bottom" format="leaderboard" />
            </div>
          </div>

          {/* Sidebar articolo */}
          <aside className="lg:col-span-4 space-y-8" aria-label="Barra laterale">
            <div className="lg:sticky lg:top-32 space-y-8">
              <AdSlot slot="mpu-article-1" format="rectangle" />
              <section aria-labelledby="related-side" className="border-t-2 border-neutral-900 pt-4">
                <h2 id="related-side" className="font-headline text-lg font-extrabold uppercase tracking-wide mb-4">Correlati</h2>
                <ul className="space-y-4">
                  {related.slice(0, 3).map((a) => (
                    <li key={a.slug}><ArticleCard article={a} variant="compact" /></li>
                  ))}
                </ul>
              </section>
              <AdSlot slot="mpu-article-2" format="halfpage" />
              <NewsletterBox />
            </div>
          </aside>
        </div>
      </article>

      {/* Articoli correlati a fondo pagina */}
      <section aria-labelledby="related-bottom" className="mx-auto max-w-7xl px-4 mt-14">
        <h2 id="related-bottom" className="font-headline text-2xl font-extrabold border-b-2 border-neutral-900 pb-2 mb-6">
          Continua a leggere su {SITE_NAME}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="large" />
          ))}
        </div>
      </section>
    </main>
  )
}

function BlockRenderer({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case 'h2':
      return (
        <>
          <h2 id={block.id} className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight pt-4 scroll-mt-32">{block.text}</h2>
          {(index === 3 || index === 7) && <AdSlot slot={`in-article-${index}`} format="infeed" className="my-2" />}
        </>
      )
    case 'h3':
      return <h3 className="font-headline text-xl font-bold pt-2">{block.text}</h3>
    case 'p':
      return (
        <p
          className="text-[1.05rem] leading-[1.85] text-neutral-800"
          dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
        />
      )
    case 'list':
      return (
        <ul className="list-disc list-inside space-y-2 text-[1.05rem] leading-relaxed text-neutral-800 marker:text-[#0e9447]">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-neutral-900 pl-5 py-1 my-2">
          <p className="font-headline text-xl italic leading-relaxed">“{block.text}”</p>
          {block.source && <cite className="block mt-2 text-sm not-italic text-neutral-500">— {block.source}</cite>}
        </blockquote>
      )
    case 'table':
      return (
        <figure className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            {block.caption && <caption className="text-left text-xs text-neutral-500 mb-2 font-semibold uppercase tracking-wide">{block.caption}</caption>}
            <thead>
              <tr className="bg-neutral-900 text-white">
                {block.headers.map((h, i) => (
                  <th key={i} scope="col" className="text-left px-3 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2.5 border-b border-neutral-200 align-top" dangerouslySetInnerHTML={{ __html: renderInline(c) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    case 'ranking':
      return (
        <section aria-label={block.title} className="border border-neutral-200 rounded-xl overflow-hidden">
          <h3 className="bg-neutral-900 text-white font-headline text-xl font-bold px-5 py-3">{block.title}</h3>
          <ol className="divide-y divide-neutral-200">
            {block.items.map((it) => (
              <li key={it.rank} className="flex gap-4 px-5 py-4">
                <span className="font-headline text-3xl font-extrabold text-[#0e9447] shrink-0 w-10">{it.rank}</span>
                <div>
                  <p className="font-bold text-neutral-900">
                    {it.url ? (
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#0e9447] underline decoration-neutral-300 underline-offset-2 hover:decoration-[#0e9447] transition-colors inline-flex items-center gap-1"
                      >
                        {it.name}
                        <ExternalLink size={13} className="shrink-0" aria-label="sito ufficiale" />
                      </a>
                    ) : (
                      it.name
                    )}
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed mt-1" dangerouslySetInnerHTML={{ __html: renderInline(it.text) }} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      )
    default:
      return null
  }
}
