/**
 * Snapshot the storefront catalogue into the Medusa backend's seed input.
 *
 *   node scripts/medusa/export-catalog.mjs
 *
 * `src/data/catalog.ts` was the storefront's only source of products before
 * Medusa. Rather than hand-copying 59 products into a seed file (and letting the
 * two drift), this imports the module as-is — Node 24 strips the TypeScript
 * types natively — and writes exactly what the seed needs.
 *
 * Output: backend/apps/backend/src/seed/catalog.json
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const catalog = await import(pathToFileURL(path.join(root, 'src/data/catalog.ts')).href);

const { PRODUCTS, CATEGORY_META, brandSlug } = catalog;

const categories = Object.entries(CATEGORY_META).map(([key, meta], rank) => ({
  key,
  name: meta.label,
  // The storefront route is the handle, so /kategori/<handle> keeps resolving.
  handle: meta.href.replace(/^\/kategori\//, ''),
  rank,
}));

const brands = [...new Set(PRODUCTS.map((p) => p.brand))].map((name) => ({
  name,
  handle: brandSlug(name),
}));

const products = PRODUCTS.map((p) => ({
  legacyId: p.id,
  handle: p.slug,
  title: p.name,
  brand: p.brand,
  sku: p.sku,
  category: p.category,
  price: p.price,
  compareAtPrice: p.compareAtPrice ?? null,
  image: p.image,
  stock: p.stock,
  instalment: p.instalment,
  badge: p.badge ?? null,
}));

const out = path.join(root, 'backend/apps/backend/src/seed/catalog.json');
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify({ categories, brands, products }, null, 2)}\n`);

console.log(
  `Wrote ${products.length} products, ${categories.length} categories, ${brands.length} brands -> ${path.relative(root, out)}`,
);
