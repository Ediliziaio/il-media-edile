#!/usr/bin/env python3
"""Genera public/feed.xml (RSS 2.0) dagli articoli.

Un feed dichiarato in <head> e' un canale di scoperta aggiuntivo: aiuta i
crawler (e gli aggregatori) a trovare i contenuti nuovi senza dipendere solo
dalla sitemap.
"""
import json, glob, os
from email.utils import format_datetime
from datetime import datetime, timezone
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://www.mediaedile.it"
NAME = "Il Media Edile"
DESC = "Notizie, guide e classifiche sull'edilizia italiana."

arts = [json.load(open(f, encoding="utf-8")) for f in glob.glob(os.path.join(ROOT, "src/articles/*.json"))]
arts.sort(key=lambda a: (a.get("date", ""), a["slug"]), reverse=True)

def rfc822(d):
    try:
        y, m, day = (int(x) for x in d.split("-"))
        return format_datetime(datetime(y, m, day, 8, 0, tzinfo=timezone.utc))
    except Exception:
        return format_datetime(datetime.now(timezone.utc))

items = []
for a in arts[:30]:
    url = f"{SITE}/{a['sectionSlug']}/{a['slug']}"
    items.append(f"""    <item>
      <title>{escape(a['title'])}</title>
      <link>{escape(url)}</link>
      <guid isPermaLink="true">{escape(url)}</guid>
      <pubDate>{rfc822(a.get('date',''))}</pubDate>
      <category>{escape(a.get('section',''))}</category>
      <description>{escape(a.get('metaDescription',''))}</description>
    </item>""")

built = rfc822(max(a.get("updated") or a.get("date", "") for a in arts))
xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{escape(NAME)}</title>
    <link>{SITE}/</link>
    <description>{escape(DESC)}</description>
    <language>it-IT</language>
    <lastBuildDate>{built}</lastBuildDate>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml" />
{chr(10).join(items)}
  </channel>
</rss>
"""
open(os.path.join(ROOT, "public", "feed.xml"), "w", encoding="utf-8").write(xml)
print(f"feed.xml generato: {len(items)} articoli")
