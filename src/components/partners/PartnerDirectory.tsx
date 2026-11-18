"use client";

import { useMemo, useState } from "react";
import { PartnerLink } from "./PartnerLink";
import { partnerPath, type Partner, type Portal } from "./partner-types";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("it");

export function PartnerDirectory({ partners, portal, trailingSlash = false }: { partners: Partner[]; portal: Portal; trailingSlash?: boolean }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const sectors = useMemo(() => [...new Set(partners.flatMap(p => p.sectors))].sort((a,b) => a.localeCompare(b,"it")), [partners]);
  const matches = partners.filter(p => (!sector || p.sectors.includes(sector)) && normalize([p.name, p.location, p.territory, ...p.services, ...p.sectors].join(" ")).includes(normalize(query.trim())));
  return <>
    <div className="partner-filters" role="search" aria-label="Cerca nell’elenco aziende">
      <div><label htmlFor="partner-query">Cerca azienda, servizio o località</label><input id="partner-query" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Es. Renova, finestre, Padova…" autoComplete="off" /></div>
      <div><label htmlFor="partner-sector">Settore</label><select id="partner-sector" value={sector} onChange={e=>setSector(e.target.value)}><option value="">Tutti i settori</option>{sectors.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
    </div>
    <div className="partner-list-meta"><p role="status" aria-live="polite">{matches.length} {matches.length===1?"azienda trovata":"aziende trovate"}</p><span>Ordine alfabetico</span>{(query||sector)&&<button type="button" onClick={()=>{setQuery("");setSector("");}}>Azzera filtri</button>}</div>
    <ul className="partner-list" aria-label="Elenco aziende partner">
      {matches.map(p=><li key={p.slug} data-partner-slug={p.slug}>
        <PartnerLink className="partner-logo" href={partnerPath(p.slug,trailingSlash)} aria-label={`Scheda di ${p.name}`}><img src={p.logo} alt={`Logo ${p.name}`} width="320" height="140" loading="lazy" /></PartnerLink>
        <div className="partner-list-copy"><p className="partner-location">{p.location}</p><h2><PartnerLink href={partnerPath(p.slug,trailingSlash)}>{p.name}</PartnerLink></h2><p>{p.focus[portal].summary}</p><div className="partner-tags">{p.sectors.map(s=><span key={s}>{s}</span>)}</div></div>
        <PartnerLink className="partner-row-link" href={partnerPath(p.slug,trailingSlash)} aria-label={`Apri la scheda di ${p.name}`}>Apri la scheda <span aria-hidden="true">→</span></PartnerLink>
      </li>)}
    </ul>
    {!matches.length&&<div className="partner-empty"><h2>Nessuna azienda corrisponde alla ricerca</h2><p>Prova un altro nome, una località o un servizio, oppure azzera i filtri per tornare all’elenco completo.</p></div>}
  </>;
}
