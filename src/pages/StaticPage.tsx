import type { ReactElement } from 'react'
import { useSeo } from '@/lib/seo'
import { SITE_NAME } from '@/lib/articles'
import { staticPageSeo } from '@/lib/seoData'

interface Props {
  page: 'chi-siamo' | 'contatti' | 'privacy' | 'cookie-policy'
}

const content: Record<Props['page'], { body: ReactElement }> = {
  'chi-siamo': {
    body: (
      <>
        <p>
          <strong>Il Media Edile</strong> è una testata giornalistica online dedicata interamente al mondo delle
          costruzioni: imprese edili, produttori di materiali e serramenti, progettisti, installatori e committenti.
        </p>
        <h2>La nostra missione</h2>
        <p>
          Informazione, edilizia, imprese: queste le tre parole che guidano il nostro lavoro quotidiano. Ogni giorno
          la redazione seleziona e verifica notizie su normative, mercato, bonus edilizi, innovazione di cantiere e
          sostenibilità, affiancandole a classifiche indipendenti dei migliori produttori e prodotti del settore.
        </p>
        <h2>Le nostre classifiche</h2>
        <p>
          Le selezioni Top 10 e Top 5 nascono da criteri editoriali dichiarati: qualità del prodotto, rete di
          assistenza, innovazione, sostenibilità e rapporto qualità-prezzo. Le classifiche sono redazionali e
          indipendenti: nessuna posizione è in vendita.
        </p>
        <h2>E-E-A-T e trasparenza</h2>
        <p>
          Ci impegnamo a rispettare i principi di Esperienza, Competenza, Autorevolezza e Affidabilità richiesti dalle
          linee guida di Google: fonti verificate, correzioni tempestive e chiara distinzione tra contenuto
          redazionale e spazi pubblicitari.
        </p>
      </>
    ),
  },
  contatti: {
    body: (
      <>
        <h2>Redazione</h2>
        <p>
          Per comunicati stampa, segnalazioni e proposte di collaborazione: <strong>redazione@mediaedile.it</strong>
        </p>
        <h2>Pubblicità</h2>
        <p>
          Il Media Edile offre spazi pubblicitari in formati IAB standard: leaderboard 728×90, billboard 970×250,
          medium rectangle 300×250, half page 300×600 e posizioni in-feed native. Per il media kit e le tariffe:
          <strong> advertising@mediaedile.it</strong>
        </p>
        <h2>Ufficio stampa e partnership</h2>
        <p>
          Aziende e associazioni di categoria interessate a partnership editoriali possono scrivere a
          <strong> partnership@mediaedile.it</strong>
        </p>
      </>
    ),
  },
  privacy: {
    body: (
      <>
        <p>
          La presente informativa descrive le modalità di trattamento dei dati personali degli utenti del sito
          Il Media Edile, ai sensi del Regolamento (UE) 2016/679 (GDPR).
        </p>
        <h2>Titolare del trattamento</h2>
        <p>Il titolare del trattamento è Il Media Edile, contattabile all'indirizzo privacy@mediaedile.it.</p>
        <h2>Dati raccolti</h2>
        <p>
          Il sito raccoglie: dati di navigazione anonimizzati a fini statistici; l'indirizzo email fornito
          volontariamente per l'iscrizione alla newsletter; eventuali dati trasmessi tramite i contatti email.
        </p>
        <h2>Finalità e base giuridica</h2>
        <p>
          I dati sono trattati per l'erogazione dei servizi richiesti (newsletter, risposta a richieste) sulla base
          del consenso dell'interessato, e per finalità statistiche aggregate sulla base del legittimo interesse.
        </p>
        <h2>Diritti dell'interessato</h2>
        <p>
          L'utente può esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione, limitazione e
          portabilità scrivendo a privacy@mediaedile.it, e proporre reclamo al Garante per la protezione dei dati
          personali.
        </p>
      </>
    ),
  },
  'cookie-policy': {
    body: (
      <>
        <p>
          Il sito Il Media Edile utilizza cookie tecnici necessari al funzionamento e, previo consenso, cookie
          analitici e pubblicitari di terze parti.
        </p>
        <h2>Cookie tecnici</h2>
        <p>
          Necessari alla navigazione e alle preferenze di base (es. consenso cookie). Non richiedono consenso.
        </p>
        <h2>Cookie analitici</h2>
        <p>
          Utilizzati in forma aggregata e anonimizzata per statistiche di lettura (es. Google Analytics con IP
          anonimizzato).
        </p>
        <h2>Cookie pubblicitari</h2>
        <p>
          Gli spazi pubblicitari possono utilizzare cookie di profilazione di terze parti (es. Google Ad Manager)
          solo previo consenso espresso tramite il banner cookie. Il consenso può essere revocato in qualsiasi
          momento dalle impostazioni del browser.
        </p>
        <h2>Gestisci le tue preferenze</h2>
        <p>
          Puoi modificare o revocare il consenso in qualsiasi momento riaprendo il pannello delle preferenze:
        </p>
        <p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
            className="bg-[#0e9447] hover:bg-[#0b7a3a] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            Gestisci preferenze cookie
          </button>
        </p>
      </>
    ),
  },
}

export default function StaticPage({ page }: Props) {
  const c = content[page]
  const seo = staticPageSeo(page)
  useSeo(seo)
  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-4">
      <h1 className="font-headline text-4xl font-extrabold border-b-4 border-double border-neutral-800 pb-3">
        {seo.title.replace(` — ${SITE_NAME}`, '')}
      </h1>
      <div className="mt-6 space-y-5 font-body text-[1.05rem] leading-[1.8] text-neutral-800 [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:pt-4">
        {c.body}
      </div>
    </main>
  )
}
