import { useEffect, useState } from 'react'
import { getConsent } from '@/components/CookieBanner'

interface AdSlotProps {
  /** Nome posizione, es. "leaderboard-top", "mpu-1", "in-article-2" */
  slot: string
  format: 'leaderboard' | 'rectangle' | 'halfpage' | 'infeed' | 'billboard'
  className?: string
}

/**
 * Interruttore generale della pubblicità.
 *
 * Finché non è collegato un ad server reale (Google Ad Manager / AdSense) gli
 * slot NON devono essere renderizzati: dei riquadri vuoti con scritto
 * "Slot rectangle · mpu-1" fanno sembrare il sito una demo incompleta, e per
 * un dominio nuovo è un segnale di bassa qualità che ostacola l'indicizzazione.
 * Passare a true SOLO dopo aver inserito i tag GPT/AdSense.
 */
const ADS_ENABLED = false

const dims: Record<AdSlotProps['format'], string> = {
  billboard: 'min-h-[250px]',
  leaderboard: 'min-h-[90px]',
  rectangle: 'min-h-[250px]',
  halfpage: 'min-h-[600px]',
  infeed: 'min-h-[120px]',
}

/**
 * Slot pubblicitario pronto per Google Ad Manager / AdSense.
 * Rispetta il consenso GDPR: se l'utente ha rifiutato i cookie pubblicitari
 * lo slot non viene proprio renderizzato. Se il consenso non è ancora stato
 * espresso, mostra il placeholder senza caricare nulla (nessuna chiamata di rete).
 * Per attivare gli annunci: inserire il tag GPT/AdSense dentro il div data-ad-slot
 * e caricarlo solo dopo `cookie-consent-changed` con advertising === true.
 */
export function AdSlot({ slot, format, className = '' }: AdSlotProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    if (!ADS_ENABLED) return
    const check = () => {
      const c = getConsent()
      setAllowed(c ? c.advertising : null)
    }
    check()
    window.addEventListener('cookie-consent-changed', check)
    return () => window.removeEventListener('cookie-consent-changed', check)
  }, [])

  // Pubblicità non ancora attiva: nessun placeholder in pagina
  if (!ADS_ENABLED) return null

  // Consenso pubblicitario esplicitamente negato: niente slot
  if (allowed === false) return null

  return (
    <div className={`flex flex-col items-center ${className}`} role="complementary" aria-label="Spazio pubblicitario">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Pubblicità</span>
      <div
        id={`ad-${slot}`}
        data-ad-slot={slot}
        data-ad-format={format}
        className={`w-full border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-neutral-400 text-xs ${dims[format]}`}
      >
        Slot {format} · {slot}
      </div>
    </div>
  )
}
