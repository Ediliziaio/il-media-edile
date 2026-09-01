#!/usr/bin/env python3
"""Genera public/sitemap.xml dagli articoli JSON de Il Media Edile.

Regole:
- dominio canonico = https://www.mediaedile.it (coerente con canonical/robots).
- lastmod reali: sezioni e home ereditano la data dell'articolo piu recente.
- la sitemap contiene SOLO URL indicizzabili: home, 7 sezioni, /classifiche,
  30 articoli e le pagine di servizio. Niente /tag (rimosse dal sito) e niente
  /cerca o 404 (noindex).
"""
import json, glob, os
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.mediaedile.it"

SECTION_SLUGS = ["news", "norme-bonus", "mercato", "materiali-prodotti",
                 "impianti", "innovazione", "sostenibilita"]
SECTION_FREQ = {"news": "daily"}  # le altre: weekly

# --- carica articoli --------------------------------------------------------
articles = []
for path in sorted(glob.glob(os.path.join(ROOT, "src", "articles", "*.json"))):
    articles.append(json.load(open(path, encoding="utf-8")))

def art_date(a):
    return a.get("updated") or a.get("date") or "2026-07-21"

latest_all = max(art_date(a) for a in articles)
latest_by_section = {s: max((art_date(a) for a in articles if a["sectionSlug"] == s),
                            default=latest_all) for s in SECTION_SLUGS}

# --- costruzione lista URL (loc, lastmod, priority, changefreq) --------------
urls = [("/", latest_all, "1.0", "daily"),
        ("/classifiche", latest_all, "0.9", "weekly"),
        ("/produttori", latest_all, "0.9", "weekly")]

for s in SECTION_SLUGS:
    urls.append((f"/{s}", latest_by_section.get(s, latest_all), "0.9",
                 SECTION_FREQ.get(s, "weekly")))

for a in articles:
    urls.append((f"/{a['sectionSlug']}/{a['slug']}", art_date(a), "0.8", "monthly"))

# pagine di servizio (bassa priorita, freschezza rara)
urls += [("/newsletter", latest_all, "0.5", "monthly"),
         ("/chi-siamo", "2026-07-21", "0.4", "yearly"),
         ("/contatti", "2026-07-21", "0.4", "yearly"),
         ("/privacy", "2026-07-21", "0.2", "yearly"),
         ("/cookie-policy", "2026-07-21", "0.2", "yearly")]

# --- serializza -------------------------------------------------------------
xml = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, lastmod, priority, freq in urls:
    xml.append("  <url>")
    xml.append(f"    <loc>{escape(SITE + loc)}</loc>")
    xml.append(f"    <lastmod>{lastmod}</lastmod>")
    xml.append(f"    <changefreq>{freq}</changefreq>")
    xml.append(f"    <priority>{priority}</priority>")
    xml.append("  </url>")
xml.append("</urlset>")

out = os.path.join(ROOT, "public", "sitemap.xml")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(xml) + "\n")

print(f"sitemap.xml generata: {len(urls)} URL indicizzabili "
      f"({len(articles)} articoli + home, {len(SECTION_SLUGS)} sezioni, "
      f"classifiche e pagine di servizio)")
