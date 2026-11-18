import { partnerPath, type Partner, type Portal } from "./partner-types";

export function partnerSchemas(partners: Partner[], portal: Portal, origin: string, slug?: string, trailingSlash = false) {
  const listUrl=`${origin}/aziende-partner${trailingSlash?"/":""}`;
  const p=partners.find(x=>x.slug===slug);
  const crumbs=[{ "@type":"ListItem", position:1, name:"Home", item:`${origin}/` },{ "@type":"ListItem", position:2, name:"Aziende partner", item:listUrl }];
  const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:p?[...crumbs,{"@type":"ListItem",position:3,name:p.name,item:origin+partnerPath(p.slug,trailingSlash)}]:crumbs};
  if(p) {
    const url=origin+partnerPath(p.slug,trailingSlash);
    return [{"@context":"https://schema.org","@type":"WebPage","@id":url+"#pagina",url,name:`${p.name} · Aziende partner`,description:p.focus[portal].summary,inLanguage:"it-IT",dateModified:p.updated,mainEntity:{"@type":"Organization","@id":url+"#azienda",name:p.name,legalName:p.legalName,url:p.website,sameAs:[p.website],logo:origin+p.logo,description:p.focus[portal].summary,...(p.phone?{telephone:p.phone}:{}),...(p.email?{email:p.email}:{}),address:{"@type":"PostalAddress",streetAddress:p.street,addressLocality:p.city,addressRegion:p.region,...(p.postalCode?{postalCode:p.postalCode}:{}),addressCountry:"IT"},knowsAbout:p.services}},breadcrumb];
  }
  return [{"@context":"https://schema.org","@type":"CollectionPage","@id":listUrl+"#pagina",url:listUrl,name:"Aziende partner",description:"Elenco alfabetico delle aziende partner: servizi, sedi e contatti ufficiali.",inLanguage:"it-IT",mainEntity:{"@id":listUrl+"#elenco"}},{"@context":"https://schema.org","@type":"ItemList","@id":listUrl+"#elenco",name:"Elenco alfabetico delle aziende partner",itemListOrder:"https://schema.org/ItemListOrderAscending",numberOfItems:partners.length,itemListElement:partners.map((p,i)=>({"@type":"ListItem",position:i+1,name:p.name,url:origin+partnerPath(p.slug,trailingSlash)}))},breadcrumb];
}
