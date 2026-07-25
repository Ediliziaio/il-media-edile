# Guida al lancio — Il Media Edile

Checklist operativa per pubblicare il sito e avviare l'indicizzazione.

## 1. Dominio e hosting

1. Registra `mediaedile.it` (se libero) o aggiorna `SITE_URL` in `src/lib/articles.ts` con il dominio definitivo.
2. Build di produzione: `npm run build` → la cartella `dist/` è un sito statico pronto.
3. Deploy consigliato (gratuito, con HTTPS e CDN inclusi):
   - **Vercel** / **Netlify**: collega la cartella del progetto, build command `npm run build`, publish `dist/`.
   - **Cloudflare Pages**: stessa configurazione.
4. Configura il fallback SPA: tutte le rotte devono servire `index.html` (su Netlify: `public/_redirects` con `/* /index.html 200`; su Vercel: rewrite automatica per Vite).

## 2. Indicizzazione

1. **Google Search Console**: verifica la proprietà del dominio → Sitemap → invia `https://<dominio>/sitemap.xml`.
2. **Bing Webmaster Tools**: importa il sito da Search Console (un click).
3. Richiedi l'indicizzazione manuale delle 5 pagine principali (home, classifiche, 3 articoli chiave).
4. Verifica dopo 48-72 ore con `site:mediaedile.it` su Google.

## 3. Monitoraggio

- Collega **Google Analytics 4** (si attiva solo dopo consenso "Analitici" del cookie banner).
- Search Console → rapporto Pagine: controlla settimanalmente copertura ed errori.
- Core Web Vitals: obiettivo LCP < 2,5 s, CLS < 0,1, INP < 200 ms su mobile.

## 4. Pubblicità (quando attiverai gli annunci)

1. Crea l'account **Google Ad Manager** (o AdSense per iniziare).
2. Per il GDPR serve una **CMP certificata IAB TCF** (es. Cookiebot, iubenda): il banner attuale gestisce già il consenso e gli slot (`AdSlot`) si attivano solo con consenso pubblicitario; la CMP andrà collegata all'evento `cookie-consent-changed` esposto dal sito.
3. Inserisci i tag GPT nei div `data-ad-slot` esistenti: le posizioni sono già predisposte (leaderboard, billboard, 2× MPU, half-page, in-feed, in-article).

## 5. Manutenzione contenuti

- Nuovo articolo: crea `src/articles/<slug>.json` seguendo `ARTICLES-SPEC.md`, genera cover e infografica, poi esegui:
  ```bash
  python3 validate_articles.py && python3 generate_sitemap.py && python3 generate_csv.py && npm run build
  ```
- Aggiorna il campo `updated` quando rivedi un articolo: Google premia la freschezza, soprattutto su bonus e norme.
- Le date e i contenuti normativi (Superbonus, Case Green) vanno riverificati a ogni cambio di legge.
