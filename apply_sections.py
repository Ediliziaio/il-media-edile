#!/usr/bin/env python3
"""Assegna sezione tematica (menu blog) a ogni articolo JSON."""
import json, glob, os

ROOT = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(ROOT, "src", "articles")

SECTIONS = {
    "news": "News",
    "norme-bonus": "Norme e Bonus",
    "mercato": "Mercato e Imprese",
    "materiali-prodotti": "Materiali e Prodotti",
    "impianti": "Impianti ed Efficienza",
    "innovazione": "Innovazione e BIM",
    "sostenibilita": "Sostenibilità",
}

MAPPING = {
    # news
    "superbonus-2026-cosa-cambia": "norme-bonus",
    "direttiva-case-green-italia": "sostenibilita",
    "pnrr-edilizia-stato-lavori-2026": "news",
    "caro-materiali-costruzione-2026": "mercato",
    "bim-obbligatorio-appalti-2026": "innovazione",
    "sicurezza-cantieri-nuove-norme": "norme-bonus",
    "mercato-immobiliare-italia-2026": "mercato",
    "edilizia-sostenibile-certificazioni": "sostenibilita",
    "carenza-manodopera-edilizia": "mercato",
    "saie-bari-fiera-edilizia-2026": "news",
    # top 10
    "top-10-produttori-serramenti-italia": "materiali-prodotti",
    "top-10-imprese-costruzione-italiane": "mercato",
    "top-10-produttori-ceramica-piastrelle-italia": "materiali-prodotti",
    "top-10-materiali-isolanti-edilizia": "sostenibilita",
    "top-10-software-bim-edilizia": "innovazione",
    "top-10-pannelli-fotovoltaici-2026": "impianti",
    "top-10-pompe-di-calore-2026": "impianti",
    "top-10-bonus-edilizi-2026": "norme-bonus",
    "top-10-macchine-movimento-terra": "mercato",
    "top-10-produttori-calcestruzzo-italia": "materiali-prodotti",
    # top 5
    "top-5-produttori-serramenti-pvc": "materiali-prodotti",
    "top-5-produttori-serramenti-alluminio": "materiali-prodotti",
    "top-5-caldaie-condensazione-2026": "impianti",
    "top-5-porte-blindate-italia": "materiali-prodotti",
    "top-5-sistemi-domotica-casa": "innovazione",
    "top-5-produttori-parquet-italia": "materiali-prodotti",
    "top-5-imprese-ristrutturazione-italia": "mercato",
    "top-5-produttori-ascensori-italia": "impianti",
    "top-5-coperture-tetti-edilizia": "materiali-prodotti",
    "top-5-vernici-pitture-edilizia": "materiali-prodotti",
}

counts = {}
for path in glob.glob(os.path.join(DIR, "*.json")):
    a = json.load(open(path, encoding="utf-8"))
    slug = a["slug"]
    sec = MAPPING[slug]
    a["section"] = SECTIONS[sec]
    a["sectionSlug"] = sec
    json.dump(a, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    counts[SECTIONS[sec]] = counts.get(SECTIONS[sec], 0) + 1

for k, v in sorted(counts.items()):
    print(f"{k}: {v} articoli")
print(f"Totale: {sum(counts.values())}")
