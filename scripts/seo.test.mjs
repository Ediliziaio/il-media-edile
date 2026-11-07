import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the generated data catalogue describes and attributes every nested dataset', () => {
  const html = readFileSync(new URL('../dist/dati/index.html', import.meta.url), 'utf8');
  const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const datasets = [];
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    if (node['@type'] === 'Dataset') datasets.push(node);
    Object.values(node).forEach(visit);
  }
  graphs.forEach(visit);
  assert.equal(datasets.length, 20);
  for (const dataset of datasets) {
    assert.ok(dataset.description?.trim().length > 10, dataset.url);
    assert.equal(dataset.creator?.['@type'], 'Organization');
    assert.ok(dataset.creator?.name && dataset.creator?.url, dataset.url);
    assert.ok(dataset.distribution?.contentUrl?.endsWith('.csv'));
  }
});
