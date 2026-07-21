#!/usr/bin/env python3
"""Aggiunge il campo "url" (sito ufficiale) a ogni voce dei blocchi ranking."""
import json, glob, os

BASE = os.path.dirname(os.path.abspath(__file__))

URL_MAP = {
    # top-10-imprese-costruzione-italiane
    "Webuild": "https://www.webuildgroup.com",
    "Pizzarotti": "https://www.pizzarotti.it",
    "Ghella": "https://www.ghella.com",
    "Rizzani de Eccher": "https://www.rizzanideeccher.com",
    "CMB": "https://www.cmbcarpi.it",
    # "ICMQ": omesso (organismo di certificazione, non impresa di costruzioni)
    "Sacaim": "https://www.sacaim.it",
    "Todini": "https://www.todini.it",
    "Bonatti": "https://www.bonatti.it",
    "Salcef Group": "https://www.salcef.com",
    # top-10-macchine-movimento-terra
    "Caterpillar 320 (escavatore)": "https://www.cat.com",
    "Komatsu PC210 (escavatore)": "https://www.komatsu.it",
    "Volvo CE EC220 (escavatore)": "https://www.volvoce.com",
    "Hitachi ZX210 (escavatore)": "https://www.hitachicm.com",
    "JCB 3CX (terna)": "https://www.jcb.com",
    "Liebherr R 926 (escavatore)": "https://www.liebherr.com",
    "Develon DX225 (escavatore)": "https://www.develon-ce.com",
    "Case CX210 (escavatore)": "https://www.casece.com",
    "SANY SY215 (escavatore)": "https://www.sanyglobal.com",
    "New Holland (gamma compatta)": "https://www.newholland.com",
    # top-10-pannelli-fotovoltaici-2026
    "Maxeon (SunPower)": "https://www.maxeon.com",
    "REC Group": "https://www.recgroup.com",
    "Panasonic": "https://www.panasonic.it",
    "Qcells": "https://www.qcells.com",
    "JA Solar": "https://www.jasolar.com",
    "Jinko Solar": "https://www.jinkosolar.com",
    "Longi": "https://www.longi.com",
    "Trina Solar": "https://www.trinasolar.com",
    "Canadian Solar": "https://www.canadiansolar.com",
    "FuturaSun": "https://www.futurasun.com",
    # top-10-pompe-di-calore-2026
    "Daikin": "https://www.daikin.it",
    "Mitsubishi Electric": "https://www.mitsubishielectric.it",
    "Vaillant": "https://www.vaillant.it",
    "Viessmann": "https://www.viessmann.it",
    "Nibe": "https://www.nibe.eu",
    "Stiebel Eltron": "https://www.stiebel-eltron.it",
    "LG": "https://www.lg.com",
    "Samsung": "https://www.samsung.it",
    "Bosch": "https://www.bosch.it",
    # top-10-produttori-calcestruzzo-italia
    "Heidelberg Materials Italia (ex Italcementi)": "https://www.italcementi.it",
    "Buzzi": "https://www.buzzi.com",
    "Colacem": "https://www.colacem.it",
    "Cementir": "https://www.cementirholding.com",
    # "Sacci": omesso (azienda fallita, asset passati a Cementir/Italsacci)
    "Cementi Rossi": "https://www.cementirossi.it",
    "Barbetti": "https://www.barbetti.it",
    # "Vianini Industria": omesso (nessun sito ufficiale verificabile)
    "Calcestruzzi": "https://www.calcestruzzi.it",
    "Unical": "https://www.unicalcestruzzi.it",
    # top-10-produttori-ceramica-piastrelle-italia
    "Marazzi": "https://www.marazzi.it",
    "Florim": "https://www.florim.com",
    "Atlas Concorde": "https://www.atlasconcorde.com",
    "Iris Ceramica Group": "https://www.irisceramicagroup.com",
    "Panariagroup": "https://www.panariagroup.it",
    "Emilgroup": "https://www.emilgroup.it",
    "Casalgrande Padana": "https://www.casalgrandepadana.it",
    "Ceramiche Refin": "https://www.refin.it",
    "Imola Ceramica": "https://www.imolaceramica.com",
    "Lea Ceramiche": "https://www.leaceramiche.com",
    # top-10-produttori-serramenti-italia
    "Internorm": "https://www.internorm.com",
    "Finstral": "https://www.finstral.com",
    "Schüco": "https://www.schueco.com",
    "Oknoplast": "https://www.oknoplast.it",
    "Metra": "https://www.metra.it",
    "Ponzio": "https://www.ponzio.it",
    "AluK": "https://www.aluk.com",
    "Nusco": "https://www.nusco.it",
    "Wicona": "https://www.wicona.com",
    "VELFAC": "https://www.velfac.com",
    # top-10-software-bim-edilizia
    "Autodesk Revit": "https://www.autodesk.it",
    "Graphisoft Archicad": "https://www.graphisoft.com",
    "ACCA Edificius": "https://www.accasoftware.com",
    "Allplan": "https://www.allplan.com",
    "Vectorworks Architect": "https://www.vectorworks.net",
    "Tekla Structures (Trimble)": "https://www.tekla.com",
    "BricsCAD BIM (Bricsys)": "https://www.bricsys.com",
    "EdiLus (ACCA)": "https://www.accasoftware.com",
    "Autodesk Navisworks": "https://www.autodesk.it",
    "Solibri": "https://www.solibri.com",
    # top-5-caldaie-condensazione-2026
    "Vaillant ecoTEC plus": "https://www.vaillant.it",
    "Viessmann Vitodens": "https://www.viessmann.it",
    "Immergas Victrix Tera": "https://www.immergas.com",
    "Baxi Luna Duo-tec+": "https://www.baxi.it",
    "Ariston Genus One": "https://www.ariston.com",
    # top-5-coperture-tetti-edilizia
    "BMI Italia (Braas e Monier)": "https://www.bmigroup.com",
    "Wierer": "https://www.wierer.it",
    "Industrie Cotto Possagno": "https://www.cottopossagno.com",
    "Isolpack": "https://www.isolpack.it",
    "Alubel": "https://www.alubel.it",
    # top-5-imprese-ristrutturazione-italia
    "EdiliziAcrobatica": "https://www.ediliziacrobatica.com",
    "CMB - Cooperativa Muratori e Braccianti di Carpi": "https://www.cmbcarpi.it",
    "Percassi": "https://www.percassi.it",
    "Instapro (rete di imprese locali)": "https://www.instapro.it",
    "Habitissimo": "https://www.habitissimo.it",
    # top-5-porte-blindate-italia
    "Dierre": "https://www.dierre.it",
    "Oikos Venezia": "https://www.oikos.it",
    "Vighi Security Doors": "https://www.vighi.it",
    "Bauxt": "https://www.bauxt.com",
    "Gardesa": "https://www.gardesa.com",
    # top-5-produttori-ascensori-italia
    "IGV Group": "https://www.igvlift.com",
    "Vimec": "https://www.vimec.biz",
    "Schindler Italia": "https://www.schindler.it",
    "KONE Italia": "https://www.kone.it",
    "TK Elevator Italia": "https://www.tkelevator.com",
    # top-5-produttori-parquet-italia
    "Listone Giordano": "https://www.listonegiordano.com",
    "Gazzotti": "https://www.gazzotti.it",
    "Berti Pavimenti Legno": "https://www.berti.net",
    "Garbelotto": "https://www.garbelotto.it",
    "Itlas": "https://www.itlas.com",
    # top-5-produttori-serramenti-alluminio
    "Schüco International Italia": "https://www.schueco.com",
    "Reynaers Aluminium": "https://www.reynaers.com",
    "Kawneer Italia": "https://www.kawneer.com",
    # top-5-produttori-serramenti-pvc
    "Veka Italia": "https://www.veka.it",
    "Aluplast": "https://www.aluplast.net",
    # top-5-sistemi-domotica-casa
    "BTicino MyHome": "https://www.bticino.it",
    "Vimar By-me Plus": "https://www.vimar.com",
    "ABB-free@home": "https://www.abb.com",
    "Gewiss": "https://www.gewiss.com",
    "Schneider Electric Wiser": "https://www.se.com",
    # top-5-vernici-pitture-edilizia
    "San Marco Group": "https://www.sanmarcogroup.com",
    "Oikos": "https://www.oikos-group.it",
    "Boero Bartolomeo": "https://www.boero.it",
    "Caparol Italia": "https://www.caparol.it",
    "Novacolor": "https://www.novacolor.it",
}

total = added = 0
omitted = []

for path in sorted(glob.glob(os.path.join(BASE, "src", "articles", "*.json"))):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    changed = False
    for b in data.get("blocks", []):
        if not (isinstance(b, dict) and b.get("type") == "ranking"):
            continue
        for item in b.get("items", []):
            total += 1
            name = item.get("name", "")
            url = URL_MAP.get(name)
            if url:
                # inserisci "url" subito dopo "name", senza toccare gli altri campi
                new_item = {}
                for k, v in item.items():
                    new_item[k] = v
                    if k == "name":
                        new_item["url"] = url
                if "url" not in new_item:
                    new_item["url"] = url
                item.clear()
                item.update(new_item)
                added += 1
                changed = True
            else:
                omitted.append((os.path.basename(path), name))
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("aggiornato:", os.path.basename(path))

print(f"\nVoci ranking totali: {total}")
print(f"Con url aggiunto:  {added}")
print(f"Omesse:            {len(omitted)}")
for fname, name in omitted:
    print(f"  - {name}  ({fname})")
