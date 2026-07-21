# Specifica articoli — Il Media Edile

Ogni articolo è un file JSON in `src/articles/<slug>.json`. Tutto il contenuto è in **italiano**.

## Schema JSON obbligatorio

```json
{
  "slug": "top-10-produttori-serramenti-italia",
  "title": "Titolo H1 giornalistico (max 90 caratteri, keyword principale all'inizio)",
  "seoTitle": "Titolo SEO max 60 caratteri con keyword + brand | Media Edile",
  "metaDescription": "150-160 caratteri, con keyword primaria e call to action",
  "category": "Top 10",
  "categorySlug": "top-10",
  "tags": ["serramenti", "infissi", "pvc"],
  "author": "Redazione Media Edile",
  "date": "2026-07-21",
  "updated": "2026-07-21",
  "readTime": 9,
  "answerBox": "Risposta diretta e completa alla domanda principale in 2-4 frasi (AEO: deve poter essere estratta come featured snippet).",
  "blocks": [ ... ],
  "faq": [
    {"q": "Domanda in linguaggio naturale?", "a": "Risposta concisa 2-4 frasi."}
  ]
}
```

## Tipi di blocco disponibili (campo `blocks`)

- `{"type":"h2","id":"slug-sezione","text":"..."}` — i `id` devono essere unici nello stesso articolo
- `{"type":"h3","text":"..."}`
- `{"type":"p","text":"..."}` — paragrafo; può contenere **grassetto** con `**testo**`
- `{"type":"list","items":["...","..."]}`
- `{"type":"ranking","title":"La classifica completa","items":[{"rank":1,"name":"Nome Azienda","text":"descrizione 60-120 parole"}]}` — per articoli Top 10 usa 10 voci, per Top 5 usa 5 voci
- `{"type":"table","caption":"...","headers":["A","B"],"rows":[["x","y"],["x2","y2"]]}`
- `{"type":"quote","text":"...","source":"..."}`

## Requisiti di contenuto (OBBLIGATORI)

1. **Lunghezza**: il testo complessivo (title + answerBox + tutti i blocchi + faq) deve essere **almeno 4500 caratteri**. Validare con lo script `validate_articles.py`.
2. **SEO**: keyword primaria nel title, nel primo paragrafo, in almeno 2 h2, nella metaDescription. Parole correlate/semantiche distribuite naturalmente.
3. **AEO**: `answerBox` con risposta diretta; sezione `faq` con **5 domande** in linguaggio naturale ("Quanto costa...", "Qual è il migliore...", "Come scegliere...").
4. **Struttura**: primo blocco `p` = lead giornalistico. Poi h2/h3 con id. Articoli classifica: intro → criteri di scelta → blocco `ranking` → h2 per approfondimenti → tabella comparativa → come scegliere → FAQ.
5. **E-E-A-T**: tono giornalistico professionale, dati di contesto di settore realistici, niente affermazioni inventate su fatti specifici datati (usa formulazioni tipo "secondo i dati di settore").
6. **Niente HTML nei testi**, niente emoji, JSON valido UTF-8.
7. `category`/`categorySlug` devono essere esattamente uno tra: `Top 10`/`top-10`, `Top 5`/`top-5`, `News`/`news`.

## Validazione

```bash
python3 /Users/agenteai/Documents/kimi/workspace/il-media-edile/validate_articles.py
```
Lo script controlla: JSON valido, campi obbligatori, lunghezza ≥4500 caratteri, 5 FAQ, blocchi validi.
