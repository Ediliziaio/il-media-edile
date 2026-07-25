import { Link } from 'react-router'
import { sections, articles, articleUrl, sectionColors } from '@/lib/articles'

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <img src="/logo.png" alt="Il Media Edile" className="h-12 w-auto mb-4 brightness-0 invert" />
          <p className="text-sm leading-relaxed text-neutral-400">
            Il Media Edile è il blog di informazione dedicato all'edilizia italiana: notizie di settore,
            guide e classifiche dei migliori produttori, norme, bonus e innovazione in cantiere.
          </p>
        </div>
        <nav aria-label="Sezioni del sito">
          <h3 className="text-white font-headline font-bold uppercase tracking-wider text-sm mb-3">Sezioni</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link to={`/${s.slug}`} className="hover:text-white inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: sectionColors[s.slug] }} />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Articoli più letti">
          <h3 className="text-white font-headline font-bold uppercase tracking-wider text-sm mb-3">Più letti</h3>
          <ul className="space-y-2 text-sm">
            {articles.slice(0, 5).map((a) => (
              <li key={a.slug}><Link to={articleUrl(a)} className="hover:text-white line-clamp-2">{a.title}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informazioni legali">
          <h3 className="text-white font-headline font-bold uppercase tracking-wider text-sm mb-3">Testata</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/chi-siamo" className="hover:text-white">Chi siamo</Link></li>
            <li><Link to="/classifiche" className="hover:text-white">Le Classifiche</Link></li>
            <li><Link to="/newsletter" className="hover:text-white">Newsletter</Link></li>
            <li><Link to="/contatti" className="hover:text-white">Contatti e pubblicità</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link to="/cookie-policy" className="hover:text-white">Cookie policy</Link></li>
            <li>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
                className="hover:text-white"
              >
                Gestisci preferenze cookie
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-neutral-500 space-y-2">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <span>© {new Date().getFullYear()} Il Media Edile — Informazione · Edilizia · Imprese</span>
            <span>Redazione: redazione@mediaedile.it</span>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Il Media Edile è una testata editoriale di <strong className="text-neutral-400">Domus Group S.r.l.</strong> —
            Sede legale: Via Aurelio Saffi 29, CAP 20123 · P.IVA 13132010961 ·
            Capitale sociale 20.000,00&nbsp;€ i.v. · PEC: domusgroupsrl@legalmail.it
          </p>
        </div>
      </div>
    </footer>
  )
}
