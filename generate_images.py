#!/usr/bin/env python3
"""Genera cover 1200x630 e infografiche 1200x675 per i 30 articoli de Il Media Edile."""
import json, glob, os, random, textwrap
from PIL import Image, ImageDraw, ImageFont
import matplotlib

ROOT = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(ROOT, "src", "articles")
OUT = os.path.join(ROOT, "public", "images")
os.makedirs(OUT, exist_ok=True)

FONT_DIR = os.path.join(matplotlib.get_data_path(), "fonts", "ttf")
BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
REG = os.path.join(FONT_DIR, "DejaVuSans.ttf")

COLORS = {
    "news": (192, 57, 43),
    "norme-bonus": (14, 148, 71),
    "mercato": (31, 78, 121),
    "materiali-prodotti": (183, 121, 31),
    "impianti": (14, 116, 144),
    "innovazione": (109, 40, 217),
    "sostenibilita": (21, 128, 61),
}

def tint(c, f):
    """mischia il colore col bianco: f=0 bianco, f=1 colore pieno"""
    return tuple(round(255 + (x - 255) * f) for x in c)

def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def skyline(draw, W, ybase, color, seed):
    rnd = random.Random(seed)
    x = 0
    while x < W:
        w = rnd.randint(50, 130)
        h = rnd.randint(40, 150)
        draw.rectangle([x, ybase - h, x + w, ybase], fill=color)
        # finestre
        for wy in range(ybase - h + 12, ybase - 10, 22):
            for wx in range(x + 10, x + w - 12, 20):
                if rnd.random() < 0.55:
                    draw.rectangle([wx, wy, wx + 8, wy + 10], fill=(255, 255, 255))
        x += w + rnd.randint(8, 26)

def spaced(s):
    return " ".join(list(s.replace(" ", "  ")))

def make_hero(a, path):
    W, H = 1200, 630
    c = COLORS[a["sectionSlug"]]
    img = Image.new("RGB", (W, H), tint(c, 0.06))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 10], fill=c)                       # barra superiore
    skyline(d, W, H, tint(c, 0.16), a["slug"])               # skyline cantieri
    d.rectangle([0, H - 6, W, H], fill=c)                    # barra inferiore

    f_label = ImageFont.truetype(BOLD, 24)
    f_title = ImageFont.truetype(BOLD, 52)
    f_brand = ImageFont.truetype(BOLD, 26)
    f_num = ImageFont.truetype(BOLD, 460)

    # numero gigante per le classifiche
    if a["categorySlug"] in ("top-10", "top-5"):
        n = "10" if a["categorySlug"] == "top-10" else "5"
        d.text((W - 60 - d.textlength(n, font=f_num), 70), n, font=f_num, fill=tint(c, 0.22))

    d.text((64, 56), spaced(a["section"].upper()), font=f_label, fill=c)
    d.rectangle([64, 100, 190, 106], fill=c)

    lines = wrap(d, a["title"], f_title, W - 128 - (380 if a["categorySlug"] in ("top-10", "top-5") else 0))
    y = 150
    for ln in lines[:5]:
        d.text((64, y), ln, font=f_title, fill=(18, 18, 18))
        y += 66
    d.text((64, H - 60), "IL MEDIA EDILE", font=f_brand, fill=c)
    img.save(path, "PNG")

def make_inline(a, path):
    W, H = 1200, 675
    c = COLORS[a["sectionSlug"]]
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 74], fill=c)
    f_head = ImageFont.truetype(BOLD, 28)
    f_name = ImageFont.truetype(BOLD, 30)
    f_txt = ImageFont.truetype(REG, 24)
    f_rank = ImageFont.truetype(BOLD, 26)
    f_small = ImageFont.truetype(BOLD, 18)

    ranking = next((b for b in a["blocks"] if b.get("type") == "ranking"), None)
    if ranking:
        d.text((48, 22), "LA CLASSIFICA — " + a["section"].upper(), font=f_head, fill=(255, 255, 255))
        items = ranking["items"]
        top = 110
        row_h = (H - top - 50) // len(items)
        maxbar = W - 340
        for it in items:
            frac = 1.0 - (it["rank"] - 1) * 0.055
            y = top + (it["rank"] - 1) * row_h
            d.ellipse([48, y + 6, 48 + row_h - 14, y + row_h - 8], fill=tint(c, 0.12))
            num = str(it["rank"])
            d.text((48 + (row_h - 14 - d.textlength(num, font=f_rank)) / 2, y + (row_h - 30) / 2),
                   num, font=f_rank, fill=c)
            bar_w = int(maxbar * frac)
            d.rounded_rectangle([110, y + 8, 110 + bar_w, y + row_h - 10], radius=10, fill=tint(c, 0.85))
            name = it["name"]
            f = f_name
            while d.textlength(name, font=f) > bar_w - 30 and f.size > 18:
                f = ImageFont.truetype(BOLD, f.size - 2)
            d.text((130, y + (row_h - f.size) / 2 - 4), name, font=f, fill=(255, 255, 255))
        d.text((48, H - 36), "Fonte: redazione Il Media Edile", font=f_small, fill=(120, 120, 120))
    else:
        # card grafica per le news: domanda chiave + tag
        d.text((48, 22), a["section"].upper() + " — IL MEDIA EDILE", font=f_head, fill=(255, 255, 255))
        skyline(d, W, H, tint(c, 0.10), a["slug"] + "inline")
        faq = a["faq"][0] if a.get("faq") else None
        f_q = ImageFont.truetype(BOLD, 40)
        y = 130
        if faq:
            d.text((64, y), "LA DOMANDA CHIAVE", font=f_small, fill=c)
            y += 34
            for ln in wrap(d, faq["q"], f_q, W - 128)[:3]:
                d.text((64, y), ln, font=f_q, fill=(18, 18, 18))
                y += 52
            y += 14
            d.rectangle([64, y, 200, y + 5], fill=c)
            y += 26
            ans = faq["a"]
            if len(ans) > 300: ans = ans[:297].rsplit(" ", 1)[0] + "…"
            for ln in wrap(d, ans, f_txt, W - 128)[:5]:
                d.text((64, y), ln, font=f_txt, fill=(70, 70, 70))
                y += 36
        # tag chips
        x = 64
        ychip = H - 130
        for t in a["tags"][:4]:
            label = "#" + t
            wch = d.textlength(label, font=f_small) + 28
            d.rounded_rectangle([x, ychip, x + wch, ychip + 34], radius=17, outline=c, width=2)
            d.text((x + 14, ychip + 8), label, font=f_small, fill=c)
            x += wch + 12
    img.save(path, "PNG")

n = 0
for p in sorted(glob.glob(os.path.join(DIR, "*.json"))):
    a = json.load(open(p, encoding="utf-8"))
    make_hero(a, os.path.join(OUT, f"{a['slug']}-hero.png"))
    make_inline(a, os.path.join(OUT, f"{a['slug']}-inline.png"))
    n += 1
print(f"Generate {n * 2} immagini in public/images/")
