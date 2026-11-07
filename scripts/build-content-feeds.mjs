import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const domain = 'https://www.mediaedile.it';
const articles = readdirSync(join(root, 'src/articles')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(readFileSync(join(root, 'src/articles', f), 'utf8')))
  .sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const url = a => `${domain}/${a.sectionSlug}/${a.slug}`;
const newest = rows => rows.map(a => a.updated || a.date).sort().at(-1);
const sitemapFile = join(root,'public/sitemap.xml');
const previous = readFileSync(sitemapFile,'utf8');
const articleUrls = new Set(articles.map(url));
// Retain the existing public hub and legal routes; article entries come from
// the same JSON registry as the renderer, including future publications.
const staticEntries = [...previous.matchAll(/<url>[\s\S]*?<\/url>/g)]
  .map(m => m[0]).filter(entry => !articleUrls.has(entry.match(/<loc>(.*?)<\/loc>/)?.[1]))
  .map(entry => {
    const loc = entry.match(/<loc>(.*?)<\/loc>/)?.[1];
    const section = loc?.slice(domain.length).replace(/^\//,'').replace(/\/$/,'');
    const date = loc === domain+'/' ? newest(articles) : newest(articles.filter(a => a.sectionSlug === section));
    return date ? entry.replace(/<lastmod>[^<]*<\/lastmod>/,`<lastmod>${date}</lastmod>`) : entry;
  });
const articleEntries = articles.map(a => {
  const image = `/images/${a.slug}-photo.webp`;
  const imageXml = existsSync(join(root,'public',image)) ? `<image:image><image:loc>${domain}${image}</image:loc><image:caption>${esc(a.title)}</image:caption></image:image>` : '';
  return `<url><loc>${esc(url(a))}</loc><lastmod>${esc(a.updated || a.date)}</lastmod>${imageXml}</url>`;
});
writeFileSync(sitemapFile,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${[...staticEntries,...articleEntries].join('\n')}\n</urlset>\n`);
const feedFile = join(root,'public/feed.xml');
let feed = readFileSync(feedFile,'utf8').replace(/\s*<item>[\s\S]*?<\/item>/g,'');
const items = articles.slice(0,20).map(a => `<item><title>${esc(a.title)}</title><link>${esc(url(a))}</link><guid isPermaLink="true">${esc(url(a))}</guid><description>${esc(a.metaDescription)}</description><pubDate>${new Date(a.date).toUTCString()}</pubDate><category>${esc(a.section)}</category></item>`).join('\n');
feed = feed.replace(/<lastBuildDate>[\s\S]*?<\/lastBuildDate>/,`<lastBuildDate>${new Date(newest(articles)).toUTCString()}</lastBuildDate>`).replace('</channel>',items+'\n</channel>');
writeFileSync(feedFile,feed);
console.log(`Content discovery: ${articles.length} articles in sitemap, ${Math.min(20,articles.length)} RSS entries`);
