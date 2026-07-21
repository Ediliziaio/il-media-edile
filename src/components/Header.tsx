import { Link, NavLink, useNavigate } from 'react-router'
import { useState } from 'react'
import { sections, articles, articleUrl } from '@/lib/articles'
import { Search, Menu, X, Flame } from 'lucide-react'

function todayLine(): string {
  const days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato']
  const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre']
  const d = new Date()
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export function Header() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const tickerItems = articles.filter((a) => a.categorySlug === 'news').slice(0, 6)

  const linkCls = (isActive: boolean) =>
    `block py-2.5 px-1 text-[13px] font-semibold tracking-tight transition-colors border-b-2 ${
      isActive ? 'text-neutral-900' : 'text-neutral-500 border-transparent hover:text-neutral-900'
    }`
  const linkStyle = (isActive: boolean, color: string) =>
    isActive ? { borderColor: color, color } : undefined

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200">
      {/* Breaking news ticker */}
      <div className="bg-neutral-950 text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-3 overflow-hidden py-1.5">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider shrink-0 text-[#35c06f]">
            <Flame size={13} /> Ultim'ora
          </span>
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-none">
            {tickerItems.map((a) => (
              <Link key={a.slug} to={articleUrl(a)} className="text-neutral-300 hover:text-white transition-colors">
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="hidden lg:block text-xs text-neutral-400 w-52">{todayLine()}</div>
          <Link to="/" className="block" aria-label="Il Media Edile — home page">
            <img src="/logo.png" alt="Il Media Edile — Informazione, Edilizia, Imprese" className="h-11 md:h-14 w-auto" />
          </Link>
          <div className="hidden md:flex w-52 justify-end">
            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/cerca?q=${encodeURIComponent(q.trim())}`) }}
              className="flex items-center border border-neutral-200 rounded-full overflow-hidden bg-neutral-50 focus-within:border-[#0e9447] transition-colors"
            >
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca nel sito…"
                aria-label="Cerca nel sito"
                className="px-3.5 py-1.5 text-sm w-36 outline-none bg-transparent"
              />
              <button type="submit" aria-label="Cerca" className="px-3 py-1.5 text-neutral-500 hover:text-[#0e9447] transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigazione principale — sezioni del blog (struttura sitelinks) */}
        <nav aria-label="Navigazione principale" className={`${open ? 'block' : 'hidden'} md:block border-t border-neutral-100`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-start gap-0.5 md:gap-5 md:overflow-x-auto md:whitespace-nowrap scrollbar-none">
            <li>
              <NavLink to="/" end className={({isActive}) => linkCls(isActive)} style={({isActive}) => linkStyle(isActive, '#0e9447')}>
                Home
              </NavLink>
            </li>
            {sections.map((s) => (
              <li key={s.slug}>
                <NavLink to={`/${s.slug}`} className={({isActive}) => linkCls(isActive)} style={({isActive}) => linkStyle(isActive, s.color)}>
                  {s.name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/classifiche"
                className={({isActive}) => `block py-2.5 px-1 text-[13px] font-bold tracking-tight transition-colors border-b-2 ${
                  isActive ? 'text-[#0e9447] border-[#0e9447]' : 'text-[#0e9447] border-transparent hover:border-[#0e9447]'
                }`}
              >
                ★ Classifiche
              </NavLink>
            </li>
            <li className="md:ml-auto">
              <NavLink to="/chi-siamo" className={({isActive}) => linkCls(isActive)} style={({isActive}) => linkStyle(isActive, '#0e9447')}>
                Chi siamo
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
