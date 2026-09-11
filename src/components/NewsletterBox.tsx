import { useState, type FormEvent } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { CRM_FORM_ID } from '@/lib/articles'
import { inviaLead } from '@/lib/eicLead'

type Stato = 'idle' | 'invio' | 'errore'

export function NewsletterBox() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [stato, setStato] = useState<Stato>('idle')

  // L'iscrizione va al CRM di Edilizia in Cloud con la campagna di provenienza;
  // la conferma compare solo quando il CRM ha accettato.
  async function iscrivi(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (stato === 'invio' || !email.includes('@')) return
    setStato('invio')
    try {
      await inviaLead(CRM_FORM_ID, { email: email.trim(), tipo: 'newsletter' })
      setDone(true)
    } catch {
      // L'email resta nel campo: si può riprovare senza riscriverla.
      setStato('errore')
      return
    }
    setStato('idle')
  }

  return (
    <section aria-labelledby="newsletter-title" className="bg-neutral-900 text-white p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={20} className="text-[#35c06f]" />
        <h2 id="newsletter-title" className="font-headline text-xl md:text-2xl font-bold">La newsletter del cantiere</h2>
      </div>
      <p className="text-sm text-neutral-300 mb-4">
        Ogni mattina alle 7: le notizie che contano per imprese, professionisti e produttori dell'edilizia. Gratis.
      </p>
      {done ? (
        <p className="flex items-center gap-2 text-[#35c06f] font-semibold text-sm">
          <CheckCircle size={18} /> Iscrizione registrata. Grazie!
        </p>
      ) : (
        <>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={iscrivi}>
            <label htmlFor="nl-email" className="sr-only">Indirizzo email</label>
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email professionale"
              className="flex-1 px-3 py-2.5 text-sm text-neutral-900 rounded-sm outline-none"
            />
            <button
              type="submit"
              disabled={stato === 'invio'}
              className="bg-[#0e9447] hover:bg-[#0b7a3a] transition-colors px-5 py-2.5 text-sm font-bold uppercase tracking-wide rounded-sm disabled:cursor-wait disabled:opacity-70"
            >
              {stato === 'invio' ? 'Invio…' : 'Iscriviti'}
            </button>
          </form>
          {stato === 'errore' && (
            <p role="alert" className="mt-2 text-sm font-semibold text-red-300">
              Invio non riuscito. Riprova tra poco.
            </p>
          )}
        </>
      )}
      <p className="text-[11px] text-neutral-500 mt-3">
        Iscrivendoti accetti la privacy policy. Niente spam, solo edilizia.
      </p>
    </section>
  )
}
