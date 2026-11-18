import { PartnerLink } from "./PartnerLink";
import { partnerPath, type Partner, type Portal } from "./partner-types";

export function PartnerProfile({ partner: p, partners, portal, trailingSlash = false }: { partner: Partner; partners: Partner[]; portal: Portal; trailingSlash?: boolean }) {
  const focus=p.focus[portal];
  const listPath=`/aziende-partner${trailingSlash?"/":""}`;
  return <>
    <nav className="partner-breadcrumb" aria-label="Percorso"><PartnerLink href="/">Home</PartnerLink><span aria-hidden="true">/</span><PartnerLink href={listPath}>Aziende partner</PartnerLink><span aria-hidden="true">/</span><span>{p.name}</span></nav>
    <header className="partner-profile-header"><div><p className="partner-kicker">Scheda azienda partner</p><h1>{p.name}</h1><p className="partner-deck">{focus.summary}</p><div className="partner-tags">{p.sectors.map(s=><span key={s}>{s}</span>)}</div></div><div className="partner-profile-logo"><img src={p.logo} alt={`Logo ${p.name}`} width="320" height="140" /></div></header>
    <div className="partner-profile-grid"><article className="partner-profile-copy">
      <section><h2>L’azienda</h2>{p.about.map(t=><p key={t}>{t}</p>)}</section>
      <section><h2>Servizi e soluzioni</h2><ul className="partner-services">{p.services.map(s=><li key={s}>{s}</li>)}</ul></section>
      <section><h2>{focus.heading}</h2>{focus.paragraphs.map(t=><p key={t}>{t}</p>)}</section>
      <section><h2>Da chiarire con l’azienda</h2><ul className="partner-questions">{focus.questions.map(q=><li key={q}>{q}</li>)}</ul></section>
      <section className="partner-sources"><h2>Riferimenti aziendali</h2><p>Le informazioni su attività, sedi e recapiti provengono dai siti ufficiali dell’azienda.</p><ul>{p.sources.map((url,i)=><li key={url}><a href={url} rel="sponsored noopener noreferrer" target="_blank">{i===0?"Sito ufficiale":`Informazioni aziendali e contatti${p.sources.length>2?` · ${i}`:""}`} <span aria-hidden="true">↗</span></a></li>)}</ul><p>Ultimo aggiornamento della scheda: <time dateTime={p.updated}>18 novembre 2026</time>.</p></section>
    </article><aside className="partner-contact" aria-label={`Contatti ${p.name}`}><p className="partner-kicker">Contatto diretto</p><h2>Parla con {p.name}</h2><p>{p.territory}</p><dl><dt>Riferimento aziendale</dt><dd>{p.legalName}</dd><dt>Indirizzo pubblicato</dt><dd>{p.address}</dd>{p.phone&&<><dt>Telefono</dt><dd><a href={`tel:${p.phone}`}>{p.phoneLabel}</a></dd></>}{p.email&&<><dt>Email</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd></>}</dl><a className="partner-primary-button" href={p.contactUrl} rel="sponsored noopener noreferrer" target="_blank">Contatta l’azienda <span aria-hidden="true">↗</span></a><a className="partner-secondary-button" href={p.website} rel="sponsored noopener noreferrer" target="_blank">Visita il sito ufficiale</a><p className="partner-small">Il collegamento apre il sito dell’azienda, dove puoi inviare la tua richiesta.</p></aside></div>
    <nav className="partner-related" aria-label="Altre aziende partner"><h2>Esplora le altre aziende</h2><div>{partners.filter(x=>x.slug!==p.slug).map(x=><PartnerLink key={x.slug} href={partnerPath(x.slug,trailingSlash)}>{x.name}<span aria-hidden="true">↗</span></PartnerLink>)}</div><PartnerLink className="partner-back" href={listPath}>← Tutte le aziende partner</PartnerLink></nav>
  </>;
}
