import { useParams } from "react-router";
import { PartnerDirectory } from "@/components/partners/PartnerDirectory";
import { PartnerProfile } from "@/components/partners/PartnerProfile";
import { PartnerLink } from "@/components/partners/PartnerLink";
import "@/components/partners/partners.css";
import { partners, partnerSeo } from "@/lib/partners";
import { useSeo } from "@/lib/seo";
import NotFound from "./NotFound";

export function PartnerDirectoryPage(){useSeo(partnerSeo());return <main className="partner-shell" data-portal="media-edile"><nav className="partner-breadcrumb" aria-label="Percorso"><PartnerLink href="/">Home</PartnerLink><span aria-hidden="true">/</span><span>Aziende partner</span></nav><header className="partner-hero"><p className="partner-kicker">Imprese e soluzioni</p><h1>Aziende partner</h1><p className="partner-deck">Il network di aziende partner di Media Edile: attività, soluzioni e contatti diretti per conoscere gli operatori del settore.</p><p className="partner-note">Elenco alfabetico di presentazioni aziendali. Le classifiche editoriali e l’indice dei produttori mantengono i propri criteri e contenuti.</p></header><PartnerDirectory partners={partners} portal="media-edile"/><p className="partner-section-note">Le schede raccolgono informazioni dai siti ufficiali delle aziende. I contatti sono disponibili nelle pagine dedicate.</p></main>;}
function ProfileContent({slug}:{slug:string}){const p=partners.find(x=>x.slug===slug)!;useSeo(partnerSeo(p.slug));return <main className="partner-shell" data-portal="media-edile"><PartnerProfile partner={p} partners={partners} portal="media-edile"/></main>;}
export function PartnerProfilePage(){const {slug}=useParams();return slug&&partners.some(x=>x.slug===slug)?<ProfileContent slug={slug}/>:<NotFound/>;}
