import { useParams } from "react-router";
import { PartnerDirectory } from "@/components/partners/PartnerDirectory";
import { PartnerProfile } from "@/components/partners/PartnerProfile";
import { PartnerLink } from "@/components/partners/PartnerLink";
import "@/components/partners/partners.css";
import { partners, partnerSeo } from "@/lib/partners";
import { useSeo } from "@/lib/seo";
import NotFound from "./NotFound";

export function PartnerDirectoryPage(){useSeo(partnerSeo());return <main className="partner-shell" data-portal="media-edile"><nav className="partner-breadcrumb" aria-label="Percorso"><PartnerLink href="/">Home</PartnerLink><span aria-hidden="true">/</span><span>Aziende partner</span></nav><header className="partner-hero"><p className="partner-kicker">Imprese e soluzioni</p><h1>Aziende partner</h1><p className="partner-deck">Prodotti e servizi per l’edilizia: imprese, showroom, software, pratiche, assistenza legale, marketing e controllo di gestione.</p><p className="partner-note">Esplora le presentazioni per settore o località e consulta i servizi per la casa e per l’organizzazione dell’impresa.</p></header><PartnerDirectory partners={partners} portal="media-edile"/><p className="partner-section-note">Elenco alfabetico delle aziende partner, con presentazioni, prodotti e contatti diretti.</p></main>;}
function ProfileContent({slug}:{slug:string}){const p=partners.find(x=>x.slug===slug)!;useSeo(partnerSeo(p.slug));return <main className="partner-shell" data-portal="media-edile"><PartnerProfile partner={p} portal="media-edile"/></main>;}
export function PartnerProfilePage(){const {slug}=useParams();return slug&&partners.some(x=>x.slug===slug)?<ProfileContent slug={slug}/>:<NotFound/>;}
