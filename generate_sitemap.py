#!/usr/bin/env python3
"""Genera public/sitemap.xml dagli articoli JSON de Il Media Edile."""
import json, glob, os
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.ilmediaedile.it"
TODAY = "2026-07-21"

urls = [
    ("/", TODAY, "1.0", "daily"),
    ("/news", TODAY, "0.9", "daily"),
    ("/norme-bonus", TODAY, "0.9", "weekly"),
    ("/mercato", TODAY, "0.9", "weekly"),
    ("/materiali-prodotti", TODAY, "0.9", "weekly"),
    ("/impianti", TODAY, "0.9", "weekly"),
    ("/innovazione", TODAY, "0.9", "weekly"),
    ("/sostenibilita", TODAY, "0.9", "weekly"),
    ("/classifiche", TODAY, "0.9", "weekly"),
    ("/newsletter", TODAY, "0.5", "monthly"),
    ("/chi-siamo", TODAY, "0.4", "monthly"),
    ("/contatti", TODAY, "0.4", "monthly"),
    ("/privacy", TODAY, "0.2", "yearly"),
    ("/cookie-policy", TODAY, "0.2", "yearly"),
]

tags = set()
for path in sorted(glob.glob(os.path.join(ROOT, "src", "articles", "*.json"))):
    a = json.load(open(path, encoding="utf-8"))
    urls.append((f"/{a['sectionSlug']}/{a['slug']}", a.get("updated", TODAY), "0.8", "weekly"))
    tags.update(a.get("tags", []))

from urllib.parse import quote
for t in sorted(tags):
    urls.append((f"/tag/{quote(t)}", TODAY, "0.6", "weekly"))

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
print(f"sitemap.xml generata: {len(urls)} URL")
