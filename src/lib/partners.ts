import raw from "@/data/partners.json";
import type { Partner } from "@/components/partners/partner-types";
import { partnerSchemas } from "@/components/partners/partner-schema";
import { SITE_URL, SITE_NAME } from "./articles";
import type { SeoOptions } from "./seo";
export const partners=raw as Partner[];
export function partnerSeo(slug?:string):SeoOptions {
 const p=partners.find(x=>x.slug===slug);
 return {title:p?`${p.name}: servizi e contatti | ${SITE_NAME}`:`Aziende partner: elenco e contatti | ${SITE_NAME}`,description:p?p.focus["media-edile"].summary:"Le aziende partner di Media Edile: un elenco alfabetico di imprese, servizi e contatti. Cerca per nome, settore o località.",canonical:`${SITE_URL}/aziende-partner${p?`/${p.slug}`:""}`,type:"website",image:p?SITE_URL+p.logo:undefined,jsonLd:partnerSchemas(partners,"media-edile",SITE_URL,p?.slug)};
}
