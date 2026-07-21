#!/usr/bin/env python3
"""Valida gli articoli JSON de Il Media Edile secondo ARTICLES-SPEC.md."""
import json, sys, glob, os

ARTICLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "articles")
REQUIRED = ["slug","title","seoTitle","metaDescription","category","categorySlug",
            "section","sectionSlug",
            "tags","author","date","updated","readTime","answerBox","blocks","faq"]
CATS = {"Top 10":"top-10","Top 5":"top-5","News":"news"}
SECTIONS = {"News":"news","Norme e Bonus":"norme-bonus","Mercato e Imprese":"mercato",
            "Materiali e Prodotti":"materiali-prodotti","Impianti ed Efficienza":"impianti",
            "Innovazione e BIM":"innovazione","Sostenibilità":"sostenibilita"}
BLOCK_TYPES = {"h2","h3","p","list","ranking","table","quote"}
MIN_CHARS = 4500

def block_text(b):
    t = b.get("type")
    if t in ("h2","h3","p"): return b.get("text","")
    if t == "list": return " ".join(b.get("items",[]))
    if t == "quote": return b.get("text","")
    if t == "table":
        return " ".join(b.get("headers",[])) + " " + " ".join(" ".join(r) for r in b.get("rows",[]))
    if t == "ranking":
        return b.get("title","") + " " + " ".join(i.get("name","")+" "+i.get("text","") for i in b.get("items",[]))
    return ""

errors = []
ok = 0
for path in sorted(glob.glob(os.path.join(ARTICLES_DIR, "*.json"))):
    name = os.path.basename(path)
    try:
        a = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        errors.append(f"{name}: JSON non valido: {e}")
        continue
    for f in REQUIRED:
        if f not in a:
            errors.append(f"{name}: campo mancante '{f}'")
    cat = a.get("category")
    if CATS.get(cat) != a.get("categorySlug"):
        errors.append(f"{name}: categoria '{cat}' / slug '{a.get('categorySlug')}' non coerenti")
    if SECTIONS.get(a.get("section")) != a.get("sectionSlug"):
        errors.append(f"{name}: sezione '{a.get('section')}' / slug '{a.get('sectionSlug')}' non coerenti")
    if a.get("slug") + ".json" != name:
        errors.append(f"{name}: slug '{a.get('slug')}' non corrisponde al nome file")
    ids = set()
    for i, b in enumerate(a.get("blocks", [])):
        if b.get("type") not in BLOCK_TYPES:
            errors.append(f"{name}: blocco {i} tipo non valido '{b.get('type')}'")
        if b.get("type") == "h2":
            if not b.get("id"): errors.append(f"{name}: h2 senza id (blocco {i})")
            elif b["id"] in ids: errors.append(f"{name}: id duplicato '{b['id']}'")
            else: ids.add(b["id"])
        if b.get("type") == "ranking":
            n = len(b.get("items", []))
            want = 10 if cat == "Top 10" else 5
            if cat in ("Top 10","Top 5") and n != want:
                errors.append(f"{name}: ranking con {n} voci, attese {want}")
    if len(a.get("faq", [])) < 5:
        errors.append(f"{name}: solo {len(a.get('faq',[]))} FAQ, minimo 5")
    total = len(a.get("title","")) + len(a.get("answerBox",""))
    total += sum(len(block_text(b)) for b in a.get("blocks", []))
    total += sum(len(f.get("q","")) + len(f.get("a","")) for f in a.get("faq", []))
    if total < MIN_CHARS:
        errors.append(f"{name}: {total} caratteri, minimo {MIN_CHARS}")
    else:
        ok += 1
        print(f"OK  {name}: {total} caratteri, {len(a['blocks'])} blocchi, {len(a['faq'])} FAQ")

print(f"\nArticoli validi: {ok}")
if errors:
    print("\nERRORI:")
    for e in errors: print(" -", e)
    sys.exit(1)
print("Tutti gli articoli superano la validazione.")
