import { Link } from 'react-router'
import { type Article, articleUrl, formatDate, heroImage, sectionColors } from '@/lib/articles'
import { Clock } from 'lucide-react'

interface Props {
  article: Article
  variant?: 'hero' | 'large' | 'standard' | 'compact' | 'list'
  rank?: number
}

const formatBadge: Record<string, string> = {
  'top-10': 'Top 10',
  'top-5': 'Top 5',
  news: 'News',
}

export function ArticleCard({ article: a, variant = 'standard', rank }: Props) {
  const url = articleUrl(a)
  const color = sectionColors[a.sectionSlug] ?? '#0e9447'
  const badge = (
    <span
      className="inline-block text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
      style={{ background: color }}
    >
      {a.section}
    </span>
  )
  const formatTag = a.categorySlug !== 'news' && (
    <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-neutral-900 text-white ml-1.5">
      {formatBadge[a.categorySlug]}
    </span>
  )

  if (variant === 'hero') {
    return (
      <article className="group">
        <Link to={url} className="block overflow-hidden rounded-xl">
          <img
            src={heroImage(a)}
            alt={a.title}
            width={1200}
            height={630}
            className="w-full aspect-[1200/630] object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </Link>
        <div className="mt-4">{badge}{formatTag}</div>
        <Link to={url}>
          <h2 className="font-headline text-2xl md:text-4xl font-extrabold leading-tight mt-2.5 group-hover:text-[#0e9447] transition-colors">
            {a.title}
          </h2>
        </Link>
        <p className="mt-3 text-base text-neutral-600 leading-relaxed">{a.answerBox}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">{a.author}</span>
          <span>·</span>
          <time dateTime={a.date}>{formatDate(a.date)}</time>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {a.readTime} min di lettura</span>
        </div>
      </article>
    )
  }

  if (variant === 'large') {
    return (
      <article className="group">
        <Link to={url} className="block overflow-hidden rounded-lg">
          <img
            src={heroImage(a)}
            alt={a.title}
            width={1200}
            height={630}
            loading="lazy"
            className="w-full aspect-[1200/630] object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>
        <div className="mt-3">{badge}{formatTag}</div>
        <Link to={url}>
          <h3 className="font-headline text-xl font-bold leading-snug mt-2 group-hover:text-[#0e9447] transition-colors">{a.title}</h3>
        </Link>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-3">{a.answerBox}</p>
        <div className="mt-2 text-xs text-neutral-500">
          <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readTime} min
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 items-start">
        {rank !== undefined && (
          <span className="font-headline text-4xl font-extrabold text-neutral-200 leading-none shrink-0 w-10 text-right">{rank}</span>
        )}
        <Link to={url} className="shrink-0 overflow-hidden rounded-md">
          <img
            src={heroImage(a)}
            alt={a.title}
            width={120}
            height={68}
            loading="lazy"
            className="w-[88px] h-[52px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="min-w-0">
          <Link to={url}>
            <h4 className="font-headline text-sm font-bold leading-snug group-hover:text-[#0e9447] transition-colors line-clamp-3">{a.title}</h4>
          </Link>
          <div className="mt-1 text-[11px] text-neutral-500">
            <span className="font-semibold" style={{ color }}>{a.section}</span> · <time dateTime={a.date}>{formatDate(a.date)}</time>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'list') {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 border-b border-neutral-200 py-6">
        <Link to={url} className="sm:w-64 shrink-0 overflow-hidden rounded-lg">
          <img
            src={heroImage(a)}
            alt={a.title}
            width={640}
            height={336}
            loading="lazy"
            className="w-full aspect-[1200/630] object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div>{badge}{formatTag}</div>
          <Link to={url}>
            <h3 className="font-headline text-xl md:text-2xl font-bold leading-snug mt-2 group-hover:text-[#0e9447] transition-colors">{a.title}</h3>
          </Link>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-2">{a.answerBox}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {a.tags.slice(0, 4).map((t) => (
              <span key={t} className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            {a.author} · <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readTime} min di lettura
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group border-b border-neutral-200 pb-4">
      <Link to={url}>
        <h3 className="font-headline text-base font-bold leading-snug group-hover:text-[#0e9447] transition-colors">{a.title}</h3>
      </Link>
      <div className="mt-1 text-xs text-neutral-500">
        <span className="font-semibold" style={{ color }}>{a.section}</span> · <time dateTime={a.date}>{formatDate(a.date)}</time>
      </div>
    </article>
  )
}
