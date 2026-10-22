import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const articles = readdirSync(join(root, 'src/articles'))
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => JSON.parse(readFileSync(join(root, 'src/articles', file), 'utf8')));
const slugify = value => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const counts = new Map();
for (const article of articles) {
  for (const tag of new Set(article.tags)) {
    for (const alias of new Set([tag, tag.toLowerCase(), slugify(tag), encodeURIComponent(tag), encodeURIComponent(tag.toLowerCase())])) {
      if (!alias) continue;
      if (!counts.has(alias)) counts.set(alias, new Map());
      const sections = counts.get(alias);
      sections.set(article.sectionSlug, (sections.get(article.sectionSlug) || 0) + 1);
    }
  }
}
const groups = new Map();
for (const [alias, countsBySection] of counts) {
  const [section] = [...countsBySection].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  if (!groups.has(section)) groups.set(section, []);
  groups.get(section).push(alias);
}
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Only known former tags migrate to a relevant existing section. Unknown paths
// keep a real 404; there is no blanket redirect to the home page.
const redirects = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([section, aliases]) => ({
  source: `/tag/:legacyTag(${aliases.sort().map(escapeRegex).join('|')})`,
  destination: `/${section}`,
  permanent: true,
}));
const configPath = join(root, 'vercel.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const expected = [...(config.redirects || []).filter(rule => !rule.source.startsWith('/tag/')), ...redirects];
if (process.argv.includes('--check')) {
  if (JSON.stringify(config.redirects) !== JSON.stringify(expected)) {
    throw new Error('Legacy tag redirects are stale. Run npm run redirects and commit vercel.json before deploying.');
  }
} else {
  config.redirects = expected;
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
}
console.log(`Legacy tags: ${counts.size} aliases in ${redirects.length} topic redirects`);
