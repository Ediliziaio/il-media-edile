import { Link } from 'react-router'
import { useSeo } from '@/lib/seo'
import { notFoundSeo } from '@/lib/seoData'
import { sections } from '@/lib/articles'

/**
 * Pagina 404. Servita da Vercel come dist/404.html (status HTTP 404) per ogni
 * URL senza file statico corrispondente, e resa client-side dalla rotta "*".
 * Marcata noindex (il meta robots viene forzato nel prerender per 404.html).
 */
export default function NotFound() {
  useSeo(notFoundSeo())
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-headline text-6xl font-extrabold text-[#0e9447]">404</p>
      <h1 className="mt-4 font-headline text-2xl md:text-3xl font-extrabold">
        Pagina non trovata
      </h1>
      <p className="mt-4 text-neutral-600">
        La pagina che cerchi non esiste o è stata spostata. Riparti dalla home o esplora le sezioni.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className="bg-[#0e9447] hover:bg-[#0b7a3a] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors"
        >
          Torna alla home
        </Link>
        <Link
          to="/classifiche"
          className="border border-neutral-300 hover:border-neutral-500 text-neutral-700 text-sm font-bold py-2.5 px-5 rounded-lg transition-colors"
        >
          Le Classifiche
        </Link>
      </div>
      <nav aria-label="Sezioni del sito" className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        {sections.map((s) => (
          <Link key={s.slug} to={`/${s.slug}`} className="text-neutral-500 hover:text-[#0e9447]">
            {s.name}
          </Link>
        ))}
      </nav>
    </main>
  )
}
