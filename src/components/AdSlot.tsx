interface AdSlotProps {
  /** Nome posizione, es. "leaderboard-top", "mpu-1", "in-article-2" */
  slot: string
  format: 'leaderboard' | 'rectangle' | 'halfpage' | 'infeed' | 'billboard'
  className?: string
}

/**
 * Interruttore generale della pubblicità.
 * Con creatività statiche interne (nessun cookie, nessuno script di terze parti)
 * resta true. Va rivalutato quando verranno collegati tag GPT/AdSense, che
 * invece richiedono il consenso pubblicitario dell'utente.
 */
const ADS_ENABLED = true

/** Destinazione della campagna. */
const AD_HREF = 'https://www.ediliziaincloud.com/'

interface Creative {
  src: string
  width: number
  height: number
  /** Larghezza massima resa: evita banner sproporzionati o testo illeggibile. */
  maxW: string
}

/**
 * Una creatività per ogni formato, scelta in base alle proporzioni reali del
 * file: così l'immagine non viene mai deformata né tagliata.
 *
 * Il tetto di larghezza conta quanto la proporzione: la creatività
 * "leaderboard" (10.8:1) in una colonna da 400px si ridurrebbe a 39px di
 * altezza, rendendo il testo illeggibile. Per gli spazi stretti (in-feed,
 * sidebar) si usano quindi le creatività più compatte.
 *
 * Le dimensioni esplicite riservano lo spazio in anticipo ed evitano il
 * layout shift (CLS) quando il banner si carica.
 */
const CREATIVES: Record<AdSlotProps['format'], Creative> = {
  // striscia larga: solo a piena larghezza, dove resta leggibile
  leaderboard: { src: '/ads/eic-leaderboard.webp', width: 1600, height: 148, maxW: 'max-w-full' },
  // formato billboard standard: non deve invadere la pagina
  billboard: { src: '/ads/eic-billboard.webp', width: 1600, height: 664, maxW: 'max-w-[970px]' },
  // MPU classico in colonna laterale
  rectangle: { src: '/ads/eic-rectangle.webp', width: 900, height: 750, maxW: 'max-w-[360px]' },
  // half page verticale 300x600: creatività nativa a quella misura, quindi il
  // tetto è 300px — ingrandirla la renderebbe sfocata.
  halfpage: { src: '/ads/eic-halfpage.webp', width: 300, height: 600, maxW: 'max-w-[300px]' },
  // dentro il flusso degli articoli: creatività compatta, testo leggibile
  infeed: { src: '/ads/eic-square.webp', width: 900, height: 654, maxW: 'max-w-[440px]' },
}

/** Creatività compatta usata al posto della striscia larga sugli schermi piccoli. */
const COMPACT: Creative = { src: '/ads/eic-square.webp', width: 900, height: 654, maxW: 'max-w-full' }

const AD_ALT =
  'EdiliziaInCloud — il gestionale con AI per l’edilizia: controlla cantieri, margini e fatturazione. Prova gratuita di 31 giorni.'

/**
 * Spazio pubblicitario.
 *
 * Mostra una creatività interna della campagna EdiliziaInCloud. Il link è
 * marcato rel="sponsored nofollow": è il requisito di Google per i link
 * promozionali e protegge il sito da segnalazioni di link scheme.
 * L'etichetta "Pubblicità" resta visibile per trasparenza, coerentemente con
 * quanto dichiarato nella pagina "Chi siamo".
 */
export function AdSlot({ slot, format, className = '' }: AdSlotProps) {
  if (!ADS_ENABLED) return null

  const c = CREATIVES[format]

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      role="complementary"
      aria-label="Spazio pubblicitario"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">Pubblicità</span>
      <a
        href={AD_HREF}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        id={`ad-${slot}`}
        data-ad-slot={slot}
        data-ad-format={format}
        className={`block w-full ${c.maxW} overflow-hidden rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors`}
      >
        {format === 'leaderboard' ? (
          <>
            {/* La striscia 10.8:1 è leggibile solo su schermi larghi: sotto md
                si passa alla creatività compatta, altrimenti su telefono
                resterebbe alta ~35px e illeggibile. */}
            <img
              src={c.src}
              alt={AD_ALT}
              width={c.width}
              height={c.height}
              loading="lazy"
              decoding="async"
              className="hidden md:block w-full h-auto"
            />
            <img
              src={COMPACT.src}
              alt={AD_ALT}
              width={COMPACT.width}
              height={COMPACT.height}
              loading="lazy"
              decoding="async"
              className="block md:hidden w-full h-auto"
            />
          </>
        ) : (
          <img
            src={c.src}
            alt={AD_ALT}
            width={c.width}
            height={c.height}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        )}
      </a>
    </div>
  )
}
