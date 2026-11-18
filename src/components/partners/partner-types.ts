export type Portal = "guida-edile" | "guida-serramenti" | "media-edile";
export interface PartnerFocus { summary: string }
export interface Partner {
  slug: string; name: string; legalName: string; website: string; contactUrl: string;
  phone: string; phoneLabel: string; email: string; location: string; territory: string;
  address: string; city: string; region: string; postalCode: string; street: string;
  sectors: string[]; services: string[]; about: string[]; sources: string[];
  presentation: { heading: string; paragraphs: string[] };
  focus: Record<Portal, PartnerFocus>; logo: string; logoBackground?: string; updated: string;
  sourceLabels?: string[]; aliases?: string[];
}
export function partnerPath(slug: string, trailingSlash = false) { return `/aziende-partner/${slug}${trailingSlash ? "/" : ""}`; }
