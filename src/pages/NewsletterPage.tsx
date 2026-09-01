import { useSeo } from '@/lib/seo'
import { newsletterSeo } from '@/lib/seoData'
import { NewsletterBox } from '@/components/NewsletterBox'
import { AdSlot } from '@/components/AdSlot'
import { CheckCircle, Mail, ShieldCheck, Clock } from 'lucide-react'

export default function NewsletterPage() {
  useSeo(newsletterSeo())

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-4">
      <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight border-b-2 border-neutral-900 pb-4">
        La newsletter del cantiere
      </h1>
      <p className="mt-5 text-lg text-neutral-700 leading-relaxed">
        Ogni mattina alle 7:00, prima del caffè del cantiere: le notizie che contano per chi costruisce,
        ristruttura e produce. Norme e bonus spiegati chiaro, prezzi dei materiali, le classifiche della settimana.
      </p>

      <ul className="mt-6 space-y-3">
        {[
          { icon: Clock, text: 'Ogni mattina alle 7:00 — 3 minuti di lettura, zero riempitivi' },
          { icon: ShieldCheck, text: 'Doppio opt-in: confermi l\u2019iscrizione via email, nessuno spam' },
          { icon: CheckCircle, text: 'Gratuita per sempre, cancellazione con un click' },
          { icon: Mail, text: 'Scritta dalla redazione, non dai comunicati stampa' },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-neutral-700">
            <Icon size={20} className="text-[#0e9447] shrink-0 mt-0.5" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <NewsletterBox />
      </div>

      <section aria-labelledby="archive" className="mt-12 border-t-2 border-neutral-900 pt-6">
        <h2 id="archive" className="font-headline text-2xl font-extrabold mb-3">Archivio delle uscite</h2>
        <p className="text-neutral-600 leading-relaxed">
          L'archivio pubblico delle newsletter sarà disponibile a breve: ogni uscita resterà consultabile online
          e indicizzabile, così i contenuti migliori continueranno a lavorare anche dopo l'invio.
        </p>
      </section>

      <div className="mt-10">
        <AdSlot slot="leaderboard-newsletter" format="infeed" />
      </div>
    </main>
  )
}
