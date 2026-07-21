import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

export function NewsletterBox() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

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
          <CheckCircle size={18} /> Iscrizione registrata. Controlla la tua email per confermare.
        </p>
      ) : (
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true) }}
        >
          <label htmlFor="nl-email" className="sr-only">Indirizzo email</label>
          <input
            id="nl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email professionale"
            className="flex-1 px-3 py-2.5 text-sm text-neutral-900 rounded-sm outline-none"
          />
          <button type="submit" className="bg-[#0e9447] hover:bg-[#0b7a3a] transition-colors px-5 py-2.5 text-sm font-bold uppercase tracking-wide rounded-sm">
            Iscriviti
          </button>
        </form>
      )}
      <p className="text-[11px] text-neutral-500 mt-3">
        Iscrivendoti accetti la privacy policy. Niente spam, solo edilizia.
      </p>
    </section>
  )
}
