#!/usr/bin/env python3
"""Genera public/sitemap.xml dagli articoli JSON de Il Media Edile.

Regole:
- dominio canonico = https://www.mediaedile.it (coerente con canonical/robots).
- lastmod reali: sezioni e home ereditano la data dell'articolo piu recente.
- niente pagine sottili: le pagine /tag sono incluse solo se hanno >= 2 articoli
  (i tag mono-articolo restano navigabili ma fuori dalla sitemap, per non
  diluire il crawl budget con thin content).
- esclusi da sitemap: /cerca (shell client-side) e 404 (noindex).
"""
import json, glob, os, re, unicodedata
from collections import defaultdict
from xml.sax.saxutils import escape


def tag_slug(tag: str) -> str:
    """Slug URL-safe, identico a tagSlug() in src/lib/articles.ts."""
    t = unicodedata.normalize("NFKD", tag).encode("ascii", "ignore").decode("ascii")
    t = t.lower()
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")

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
latest_by_section = defaultdict(lambda: latest_all)
tag_dates = defaultdict(list)
tag_count = defaultdict(int)
for a in articles:
    d = art_date(a)
    latest_by_section[a["sectionSlug"]] = max(latest_by_section[a["sectionSlug"]], d) \
        if a["sectionSlug"] in latest_by_section else d
    for t in a.get("tags", []):
        tag_count[t] += 1
        tag_dates[t].append(d)

# ricalcolo pulito del max per sezione
latest_by_section = {s: max((art_date(a) for a in articles if a["sectionSlug"] == s),
                            default=latest_all) for s in SECTION_SLUGS}

# --- costruzione lista URL (loc, lastmod, priority, changefreq) --------------
urls = [("/", latest_all, "1.0", "daily"),
        ("/classifiche", latest_all, "0.9", "weekly")]

for s in SECTION_SLUGS:
    urls.append((f"/{s}", latest_by_section.get(s, latest_all), "0.9",
                 SECTION_FREQ.get(s, "weekly")))

for a in articles:
    urls.append((f"/{a['sectionSlug']}/{a['slug']}", art_date(a), "0.8", "monthly"))

# solo tag con >= 2 articoli
kept_tags = sorted(t for t, n in tag_count.items() if n >= 2)
for t in kept_tags:
    urls.append((f"/tag/{tag_slug(t)}", max(tag_dates[t]), "0.5", "weekly"))

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

print(f"sitemap.xml generata: {len(urls)} URL "
      f"({len(articles)} articoli, {len(kept_tags)} tag >=2 art., "
      f"{len(tag_count) - len(kept_tags)} tag mono-articolo esclusi)")
