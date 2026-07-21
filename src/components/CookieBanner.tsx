import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Cookie, X } from 'lucide-react'

const KEY = 'me-cookie-consent-v1'

export interface Consent {
  necessary: true
  analytics: boolean
  advertising: boolean
  ts: number
}

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

function save(c: Omit<Consent, 'ts'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...c, ts: Date.now() }))
  } catch {
    /* storage non disponibile */
  }
  window.dispatchEvent(new CustomEvent('cookie-consent-changed'))
}

/**
 * Cookie banner GDPR: leggero (nessuna dipendenza), mobile-first (bottom sheet),
 * si mostra solo se manca il consenso e si riapre con l'evento "open-cookie-preferences".
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [advertising, setAdvertising] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)
    const reopen = () => {
      const c = getConsent()
      setAnalytics(c?.analytics ?? false)
      setAdvertising(c?.advertising ?? false)
      setCustomize(true)
      setVisible(true)
    }
    window.addEventListener('open-cookie-preferences', reopen)
    return () => window.removeEventListener('open-cookie-preferences', reopen)
  }, [])

  if (!visible) return null

  const acceptAll = () => { save({ necessary: true, analytics: true, advertising: true }); setVisible(false) }
  const rejectAll = () => { save({ necessary: true, analytics: false, advertising: false }); setVisible(false) }
  const savePrefs = () => { save({ necessary: true, analytics, advertising }); setVisible(false) }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Preferenze cookie"
      className="fixed inset-x-0 bottom-0 z-[100] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md"
    >
      <div className="bg-white border border-neutral-200 shadow-2xl rounded-t-2xl sm:rounded-2xl p-5 safe-bottom">
        <div className="flex items-start justify-between gap-3">
          <p className="font-headline font-extrabold text-base inline-flex items-center gap-2">
            <Cookie size={18} className="text-[#0e9447]" /> Rispettiamo la tua privacy
          </p>
          <button onClick={rejectAll} aria-label="Chiudi e rifiuta" className="text-neutral-400 hover:text-neutral-700 p-1 -m-1">
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
          Usiamo cookie tecnici necessari al funzionamento e, solo con il tuo consenso, cookie analitici
          e pubblicitari. Leggi la{' '}
          <Link to="/cookie-policy" className="text-[#0e9447] font-semibold hover:underline">cookie policy</Link>{' '}
          e la{' '}
          <Link to="/privacy" className="text-[#0e9447] font-semibold hover:underline">privacy policy</Link>.
        </p>

        {customize && (
          <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
            <ToggleRow label="Necessari" desc="Sempre attivi, indispensabili per il sito" checked disabled onChange={() => {}} />
            <ToggleRow label="Analitici" desc="Statistiche di lettura aggregate e anonime" checked={analytics} onChange={setAnalytics} />
            <ToggleRow label="Pubblicitari" desc="Annunci personalizzati negli spazi adv" checked={advertising} onChange={setAdvertising} />
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 bg-[#0e9447] hover:bg-[#0b7a3a] text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
          >
            Accetta tutti
          </button>
          {customize ? (
            <button
              onClick={savePrefs}
              className="flex-1 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
            >
              Salva preferenze
            </button>
          ) : (
            <button
              onClick={() => setCustomize(true)}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
            >
              Personalizza
            </button>
          )}
          <button
            onClick={rejectAll}
            className="flex-1 border border-neutral-300 hover:border-neutral-500 text-neutral-700 text-sm font-bold py-2.5 px-4 rounded-lg transition-colors"
          >
            Rifiuta
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, checked, disabled, onChange }: {
  label: string
  desc: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-neutral-500">{desc}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={(e) => { e.preventDefault(); if (!disabled) onChange(!checked) }}
        className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${checked ? 'bg-[#0e9447]' : 'bg-neutral-300'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </button>
    </label>
  )
}
