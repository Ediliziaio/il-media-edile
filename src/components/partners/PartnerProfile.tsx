import { PartnerLink } from "./PartnerLink";
import { partnerPath, type Partner, type Portal } from "./partner-types";

export function PartnerProfile({ partner: p, partners, portal, trailingSlash = false }: {
  partner: Partner; partners: Partner[]; portal: Portal; trailingSlash?: boolean;
}) {
  const focus = p.focus[portal];
  const listPath = `/aziende-partner${trailingSlash ? "/" : ""}`;
  return <>
    <nav className="partner-breadcrumb" aria-label="Percorso">
      <PartnerLink href="/">Home</PartnerLink><span aria-hidden="true">/</span>
      <PartnerLink href={listPath}>Aziende partner</PartnerLink><span aria-hidden="true">/</span><span>{p.name}</span>
    </nav>
    <header className="partner-profile-header">
      <div>
        <p className="partner-kicker">Azienda partner · {p.location}</p>
        <h1>{p.name}</h1><p className="partner-deck">{focus.summary}</p>
        <div className="partner-tags">{p.sectors.map(s => <span key={s}>{s}</span>)}</div>
      </div>
      <div className="partner-profile-logo" style={{ backgroundColor: p.logoBackground }}>
        <img src={p.logo} alt={`Logo ${p.name}`} width="320" height="140" />
      </div>
    </header>
    <nav className="partner-profile-nav" aria-label="Sezioni della presentazione">
      <a href="#azienda">Presentazione</a><a href="#servizi">Prodotti e servizi</a><a href="#contatti">Contatti</a>
    </nav>
    <div className="partner-profile-grid">
      <article className="partner-profile-copy">
        <section id="azienda"><h2>Conosci {p.name}</h2>{p.about.map(t => <p key={t}>{t}</p>)}</section>
        <section><h2>{p.presentation.heading}</h2>{p.presentation.paragraphs.map(t => <p key={t}>{t}</p>)}</section>
        <section id="servizi"><h2>Prodotti e servizi</h2><ul className="partner-services">{p.services.map(s => <li key={s}>{s}</li>)}</ul></section>
        <section><h2>{focus.heading}</h2>{focus.paragraphs.map(t => <p key={t}>{t}</p>)}</section>
        <section className="partner-sources"><h2>Scopri di più</h2>
          <ul>{p.sources.map((url, i) => <li key={url}><a href={url} rel="sponsored noopener noreferrer" target="_blank">{p.sourceLabels?.[i] || (i === 0 ? "Sito ufficiale" : "Scopri l’azienda")} <span aria-hidden="true">↗</span></a></li>)}</ul>
          <p>Presentazione aggiornata il <time dateTime={p.updated}>18 novembre 2026</time>.</p>
        </section>
      </article>
      <aside id="contatti" className="partner-contact" aria-label={`Contatti ${p.name}`}>
        <p className="partner-kicker">Il prossimo passo</p><h2>Il tuo progetto con {p.name}</h2>
        <p>{p.territory}</p>
        <a className="partner-primary-button" href={p.contactUrl} rel="sponsored noopener noreferrer" target="_blank">Contatta {p.name} <span aria-hidden="true">↗</span></a>
        <a className="partner-secondary-button" href={p.website} rel="sponsored noopener noreferrer" target="_blank">Visita il sito ufficiale</a>
        <dl>
          <dt>Dove trovarla</dt><dd>{p.address}</dd>
          {p.phone && <><dt>Telefono</dt><dd><a href={`tel:${p.phone}`}>{p.phoneLabel}</a></dd></>}
          {p.email && <><dt>Email</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd></>}
        </dl>
        {p.legalName && <p className="partner-small">{p.legalName}</p>}
      </aside>
    </div>
    <nav className="partner-related" aria-label="Altre aziende partner"><h2>Altre aziende da conoscere</h2>
      <div>{partners.filter(x => x.slug !== p.slug).map(x => <PartnerLink key={x.slug} href={partnerPath(x.slug, trailingSlash)}>{x.name}<span aria-hidden="true">↗</span></PartnerLink>)}</div>
      <PartnerLink className="partner-back" href={listPath}>← Tutte le aziende partner</PartnerLink>
    </nav>
  </>;
}
