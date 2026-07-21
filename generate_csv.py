#!/usr/bin/env python3
"""Genera i CSV scaricabili delle classifiche (public/downloads/)."""
import json, glob, os, csv

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "public", "downloads")
os.makedirs(OUT, exist_ok=True)

n = 0
for path in sorted(glob.glob(os.path.join(ROOT, "src", "articles", "*.json"))):
    a = json.load(open(path, encoding="utf-8"))
    ranking = next((b for b in a["blocks"] if b.get("type") == "ranking"), None)
    if not ranking:
        continue
    out = os.path.join(OUT, f"{a['slug']}-classifica.csv")
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["Posizione", "Nome", "Sito ufficiale", "Descrizione"])
        for it in ranking["items"]:
            w.writerow([it["rank"], it["name"], it.get("url", ""), it["text"]])
    n += 1
print(f"Generati {n} CSV in public/downloads/")
