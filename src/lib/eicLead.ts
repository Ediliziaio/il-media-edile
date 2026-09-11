/**
 * Invio dei contatti del sito al CRM di Edilizia in Cloud.
 *
 * I form del sito (contatti, newsletter, pubblicità) mandano qui i dati: si
 * crea il contatto nel CRM con la campagna di provenienza (UTM, gclid,
 * fbclid) e la pagina da cui è partito l'invio. I parametri si salvano
 * all'atterraggio perché chi arriva da un annuncio sulla home e poi apre
 * "Contatti" non li ha più nell'indirizzo.
 */
const ENDPOINT = "https://rsbrguhkodgnqfomrevo.supabase.co/functions/v1/form-submit";
const CHIAVI = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "wbraid", "gbraid", "fbclid", "ttclid", "msclkid", "li_fat_id",
] as const;
const CHIAVE_STORAGE = "eic_parametri_campagna";
const DURATA_MS = 30 * 24 * 60 * 60 * 1000;

/** Salva i parametri dell'indirizzo corrente (vince l'ultimo clic). Da chiamare all'avvio. */
export function salvaParametriCampagna(): void {
  if (typeof window === "undefined") return;
  try {
    const qs = new URLSearchParams(window.location.search);
    const trovati: Record<string, string> = {};
    for (const k of CHIAVI) {
      const v = qs.get(k);
      if (v) trovati[k] = v.slice(0, 300);
    }
    if (Object.keys(trovati).length === 0) return;
    localStorage.setItem(CHIAVE_STORAGE, JSON.stringify({ t: Date.now(), p: trovati }));
  } catch {
    /* storage bloccato: l'invio funziona lo stesso, senza campagna */
  }
}

export function parametriCampagna(): Record<string, string> {
  if (typeof window === "undefined") return {};
  salvaParametriCampagna();
  try {
    const raw = localStorage.getItem(CHIAVE_STORAGE);
    if (!raw) return {};
    const { t, p } = JSON.parse(raw) as { t?: number; p?: Record<string, string> };
    return t && Date.now() - t < DURATA_MS ? p ?? {} : {};
  } catch {
    return {};
  }
}

/**
 * Manda un contatto al CRM. `data` usa le chiavi del form in Edilizia in Cloud:
 * nome, email, telefono, azienda, messaggio, tipo ("contatto" | "newsletter" | "pubblicita").
 * Risolve se il CRM ha accettato, altrimenti lancia un errore.
 */
export async function inviaLead(formId: string, data: Record<string, string | undefined>): Promise<void> {
  const pulito = Object.fromEntries(Object.entries(data).filter(([, v]) => v != null && String(v).trim() !== ""));
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_id: formId,
      data: pulito,
      page_url: window.location.href,
      referrer: document.referrer || null,
      ...parametriCampagna(),
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || json.error) throw new Error(json.error || `Invio non riuscito (${res.status})`);
}
