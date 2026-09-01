import type { ReactElement } from 'react'
import { Link } from 'react-router'
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
          <strong>Il Media Edile</strong> è un sito di informazione dedicato interamente al mondo delle costruzioni:
          imprese edili, produttori di materiali e serramenti, progettisti, installatori e committenti. Pubblichiamo
          notizie di settore, guide operative e classifiche redazionali dei prodotti e dei produttori italiani.
        </p>
        <p>
          Il sito è edito da <strong>Domus Group S.r.l.</strong> Non è una testata giornalistica registrata ai sensi
          della legge 62/2001: è un sito di informazione aggiornato in modo non periodico, e per questo non è
          sottoposto a registrazione presso il Tribunale.
        </p>

        <h2>La nostra missione</h2>
        <p>
          Informazione, edilizia, imprese. L&apos;edilizia italiana è un settore in cui norme, incentivi e tecnologie
          cambiano rapidamente e le informazioni sono spesso disperse tra fonti tecniche, normative e commerciali.
          Il nostro lavoro è raccoglierle, verificarle e restituirle in una forma leggibile a chi in cantiere e in
          ufficio deve prendere decisioni concrete.
        </p>

        <h2>Come lavoriamo</h2>
        <ul>
          <li>
            <strong>Fonti primarie.</strong> Partiamo da testi normativi, documenti ufficiali (Gazzetta Ufficiale,
            Agenzia delle Entrate, ENEA, ISTAT), dati di settore e documentazione tecnica dei produttori. Dove
            possibile citiamo e colleghiamo la fonte all&apos;interno dell&apos;articolo.
          </li>
          <li>
            <strong>Verifica.</strong> Ogni contenuto che riguarda bonus fiscali, scadenze e obblighi di legge viene
            controllato rispetto alla normativa vigente alla data di pubblicazione, indicata in ogni articolo.
          </li>
          <li>
            <strong>Aggiornamento.</strong> Gli articoli su incentivi e normativa vengono rivisti quando il quadro
            di riferimento cambia. La data di aggiornamento è sempre esposta accanto a quella di pubblicazione.
          </li>
          <li>
            <strong>Correzioni.</strong> Se rilevi un errore o un dato non aggiornato, scrivici a{' '}
            <strong>redazione@mediaedile.it</strong>: verifichiamo e, se la segnalazione è fondata, correggiamo
            indicando l&apos;intervento.
          </li>
        </ul>

        <h2>Il metodo delle classifiche</h2>
        <p>
          Le selezioni <strong>Top 10</strong> e <strong>Top 5</strong> sono redazionali. Non sono un ranking di
          vendita né un elenco a pagamento: <strong>nessuna posizione è acquistabile</strong> e nessun produttore può
          influenzare l&apos;ordine. I criteri che applichiamo sono dichiarati e costanti:
        </p>
        <ul>
          <li><strong>Qualità e prestazioni</strong> del prodotto, con riferimento a dati tecnici e certificazioni dichiarate dal produttore.</li>
          <li><strong>Presenza e assistenza in Italia</strong>: rete commerciale, supporto tecnico, disponibilità dei ricambi.</li>
          <li><strong>Innovazione</strong>: investimenti in ricerca, soluzioni introdotte sul mercato.</li>
          <li><strong>Sostenibilità</strong>: certificazioni ambientali, efficienza, gestione del fine vita.</li>
          <li><strong>Rapporto qualità-prezzo</strong> rispetto al segmento di mercato di riferimento.</li>
        </ul>
        <p>
          Le classifiche fotografano il mercato alla data indicata nell&apos;articolo e vengono riviste nel tempo.
          Dove disponibile, pubblichiamo i dati anche in formato <strong>CSV riutilizzabile</strong>, citando la fonte.
        </p>

        <h2>Pubblicità e trasparenza</h2>
        <p>
          Manteniamo una separazione netta tra contenuto redazionale e spazi pubblicitari: gli eventuali spazi a
          pagamento sono sempre identificati come tali e non influenzano la selezione né l&apos;ordine dei contenuti.
          Per informazioni commerciali: <strong>advertising@mediaedile.it</strong>.
        </p>

        <h2>Editore</h2>
        <p>
          <strong>Domus Group S.r.l.</strong><br />
          Sede legale: Via Aurelio Saffi 29, 20123 Milano<br />
          P.IVA 13132010961 — Capitale sociale 20.000,00 € i.v.<br />
          PEC: domusgroupsrl@legalmail.it
        </p>
        <p>
          Per contattarci: <Link to="/contatti">pagina contatti</Link>. Per il trattamento dei dati:{' '}
          <Link to="/privacy">privacy policy</Link> e <Link to="/cookie-policy">cookie policy</Link>.
        </p>
      </>
    ),
  },

  contatti: {
    body: (
      <>
        <h2>Redazione</h2>
        <p>
          Per comunicati stampa, segnalazioni, correzioni e proposte di collaborazione:{' '}
          <strong>redazione@mediaedile.it</strong>
        </p>
        <p>
          Se segnali un errore in un articolo, indicaci l&apos;URL della pagina e il dato che ritieni sbagliato:
          verifichiamo e correggiamo, dandone conto nel testo.
        </p>

        <h2>Pubblicità</h2>
        <p>
          Il Media Edile offre spazi pubblicitari in formati IAB standard: leaderboard 728×90, billboard 970×250,
          medium rectangle 300×250, half page 300×600 e posizioni in-feed native. Per il media kit e le tariffe:{' '}
          <strong>advertising@mediaedile.it</strong>
        </p>

        <h2>Ufficio stampa e partnership</h2>
        <p>
          Aziende e associazioni di categoria interessate a partnership editoriali possono scrivere a{' '}
          <strong>partnership@mediaedile.it</strong>
        </p>

        <h2>Dati dell&apos;editore</h2>
        <p>
          <strong>Domus Group S.r.l.</strong><br />
          Sede legale: Via Aurelio Saffi 29, 20123 Milano<br />
          P.IVA 13132010961 — Capitale sociale 20.000,00 € i.v.<br />
          PEC: domusgroupsrl@legalmail.it
        </p>
      </>
    ),
  },

  privacy: {
    body: (
      <>
        <p>
          La presente informativa descrive le modalità di trattamento dei dati personali degli utenti del sito
          Il Media Edile, ai sensi del Regolamento (UE) 2016/679 (&ldquo;GDPR&rdquo;) e del D.lgs. 196/2003 come
          modificato dal D.lgs. 101/2018.
        </p>

        <h2>Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento è <strong>Domus Group S.r.l.</strong>, Via Aurelio Saffi 29, 20123 Milano,
          P.IVA 13132010961 — PEC domusgroupsrl@legalmail.it. Per ogni questione relativa ai dati personali è
          possibile scrivere a <strong>privacy@mediaedile.it</strong>.
        </p>

        <h2>Dati trattati</h2>
        <ul>
          <li><strong>Dati di navigazione</strong>: indirizzo IP, tipo di browser e dispositivo, pagine visitate, data e ora, raccolti dai sistemi informatici necessari al funzionamento del sito e, in forma aggregata, per statistiche di lettura.</li>
          <li><strong>Indirizzo email</strong>, se fornito volontariamente per l&apos;iscrizione alla newsletter.</li>
          <li><strong>Dati di contatto</strong> e contenuto dei messaggi, se ci scrivi a uno degli indirizzi email pubblicati.</li>
          <li><strong>Cookie e identificatori</strong>: vedi la <Link to="/cookie-policy">cookie policy</Link>.</li>
        </ul>

        <h2>Finalità e basi giuridiche</h2>
        <ul>
          <li><strong>Erogazione del sito e sicurezza</strong> — legittimo interesse del titolare (art. 6.1.f GDPR).</li>
          <li><strong>Invio della newsletter</strong> — consenso dell&apos;interessato (art. 6.1.a), revocabile in qualsiasi momento tramite il link di disiscrizione presente in ogni messaggio.</li>
          <li><strong>Risposta alle richieste</strong> ricevute via email — riscontro a richiesta dell&apos;interessato (art. 6.1.b).</li>
          <li><strong>Statistiche di lettura e pubblicità</strong> — consenso espresso tramite il banner cookie (art. 6.1.a).</li>
          <li><strong>Adempimenti di legge</strong> — obbligo legale (art. 6.1.c).</li>
        </ul>

        <h2>Destinatari e responsabili</h2>
        <p>
          I dati possono essere trattati da fornitori tecnici che agiscono come responsabili del trattamento:
          il provider di hosting e distribuzione dei contenuti, il servizio di invio della newsletter e, previo
          consenso, i fornitori di statistiche e di pubblicità. I dati non sono diffusi né ceduti a terzi per
          finalità autonome.
        </p>

        <h2>Trasferimento dei dati fuori dall&apos;Unione Europea</h2>
        <p>
          I server che ospitano il sito e alcuni fornitori tecnici <strong>possono trovarsi al di fuori dello Spazio
          economico europeo</strong>, in particolare negli Stati Uniti. In questi casi il trasferimento avviene sulla
          base delle garanzie previste dal Capo V del GDPR: decisioni di adeguatezza della Commissione europea
          oppure clausole contrattuali standard, unitamente a misure supplementari ove necessarie.
        </p>

        <h2>Periodo di conservazione</h2>
        <ul>
          <li>Log tecnici e di sicurezza: di norma non oltre 12 mesi.</li>
          <li>Dati della newsletter: fino alla revoca del consenso o alla disiscrizione.</li>
          <li>Corrispondenza via email: per il tempo necessario a gestire la richiesta e per i successivi obblighi di legge.</li>
          <li>Dati statistici e pubblicitari: secondo le durate indicate nella <Link to="/cookie-policy">cookie policy</Link>.</li>
        </ul>

        <h2>Diritti dell&apos;interessato</h2>
        <p>
          Puoi esercitare in qualsiasi momento i diritti previsti dagli articoli 15-22 del GDPR: accesso, rettifica,
          cancellazione, limitazione, portabilità, opposizione al trattamento e revoca del consenso (che non pregiudica
          la liceità del trattamento effettuato prima della revoca). Le richieste vanno inviate a{' '}
          <strong>privacy@mediaedile.it</strong> e ricevono riscontro entro un mese.
        </p>
        <p>
          Hai inoltre il diritto di proporre reclamo al <strong>Garante per la protezione dei dati personali</strong>{' '}
          (Piazza Venezia 11, 00187 Roma — garanteprivacy.it).
        </p>

        <h2>Natura del conferimento</h2>
        <p>
          Il conferimento dei dati di navigazione è necessario al funzionamento del sito. Il conferimento
          dell&apos;email per la newsletter è facoltativo: in mancanza non sarà possibile ricevere il servizio.
        </p>

        <h2>Modifiche</h2>
        <p>
          Questa informativa può essere aggiornata: le modifiche sono pubblicate su questa pagina. Ultimo
          aggiornamento indicato in calce al sito.
        </p>
      </>
    ),
  },

  'cookie-policy': {
    body: (
      <>
        <p>
          Il sito Il Media Edile utilizza cookie e tecnologie analoghe. I cookie sono piccoli file di testo che i
          siti visitati inviano al dispositivo dell&apos;utente, dove vengono memorizzati per essere ritrasmessi agli
          stessi siti alla visita successiva. Titolare del trattamento è <strong>Domus Group S.r.l.</strong>
          (vedi <Link to="/privacy">privacy policy</Link>).
        </p>

        <h2>Cookie tecnici e strumenti necessari</h2>
        <p>
          Necessari al funzionamento del sito e alla memorizzazione delle tue preferenze, incluso il registro del
          consenso ai cookie, conservato nel browser tramite <em>local storage</em> con durata massima di 12 mesi.
          Non richiedono consenso e non possono essere disattivati.
        </p>

        <h2>Cookie analitici</h2>
        <p>
          Utilizzati per produrre statistiche aggregate di lettura (pagine viste, provenienza del traffico, tempo di
          permanenza). Vengono attivati <strong>solo dopo il tuo consenso</strong> tramite il banner. Se in futuro
          verranno impiegati strumenti di terze parti, saranno configurati con anonimizzazione dell&apos;indirizzo IP.
        </p>

        <h2>Cookie pubblicitari e di profilazione</h2>
        <p>
          Gli spazi pubblicitari possono avvalersi di cookie di terze parti per la selezione e la misurazione degli
          annunci. Sono attivati <strong>esclusivamente previo consenso espresso</strong> tramite il banner; se
          rifiuti, gli spazi pubblicitari non caricano alcuno script di profilazione.
        </p>

        <h2>Base giuridica e durata</h2>
        <p>
          I cookie tecnici si basano sul legittimo interesse del titolare; i cookie analitici e pubblicitari sul tuo
          consenso (art. 6.1.a GDPR e art. 122 del Codice privacy). Il consenso viene richiesto nuovamente al più
          tardi dopo 12 mesi, oppure se cambiano le finalità o i fornitori.
        </p>

        <h2>Gestire o revocare il consenso</h2>
        <p>
          Puoi modificare o revocare le tue scelte in qualsiasi momento riaprendo il pannello delle preferenze:
        </p>
        <p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
            className="bg-[#0e9447] hover:bg-[#0b7a3a] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            Gestisci preferenze cookie
          </button>
        </p>
        <p>
          Puoi inoltre bloccare o cancellare i cookie dalle impostazioni del tuo browser (Chrome, Firefox, Safari,
          Edge). La disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito.
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
      <div className="mt-6 space-y-5 font-body text-[1.05rem] leading-[1.8] text-neutral-800 [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-[#0e9447] [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2">
        {c.body}
      </div>
    </main>
  )
}
