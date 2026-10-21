/**
 * Catalogue query layer: parse filters out of the URL, apply them, count facets.
 *
 * Filters live in the URL and nowhere else. That is a deliberate choice, not a
 * shortcut: a filtered listing is then shareable, survives the back button,
 * renders on the server with no client state, and keeps working with JavaScript
 * off. docs/INFORMATION_ARCHITECTURE §2 also rules that filter combinations are
 * UX state rather than landing pages, so the canonical drops every parameter.
 *
 * Parameter names follow the documented example
 * (`?marka=…&siralama=fiyat-artan`).
 */

import { brandSlug, categoryMeta, type Product } from '@/data/catalog';
import { INSTALMENTS_AVAILABLE } from '@/data/checkout';

/**
 * Turkish-forgiving fold: lower-cases with the Turkish locale, then flattens
 * diacritics so "güvenlik" matches "guvenlik" and "ışıldak" matches "isildak".
 * Someone hunting a part number should not have to get the accents right.
 */
const fold = (value: string) =>
  value
    .toLocaleLowerCase('tr')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Search.
 *
 * Every token must appear somewhere in the product (AND, not OR): typing two
 * words should narrow, not widen. Results are ranked by WHERE the tokens hit —
 * a product code is a far stronger signal than a word buried in a description,
 * which is what makes "PV-16" land on the right product first.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const tokens = fold(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { product: Product; score: number }[] = [];

  for (const product of products) {
    const sku = fold(product.sku);
    const brand = fold(product.brand);
    const name = fold(product.name);
    const category = fold(categoryMeta(product.category).label);
    const haystack = `${brand} ${name} ${sku} ${category}`;

    let score = 0;
    const matchedAll = tokens.every((token) => {
      if (!haystack.includes(token)) return false;
      if (sku.includes(token)) score += 4;
      else if (brand.includes(token)) score += 3;
      else if (name.includes(token)) score += 2;
      else score += 1;
      return true;
    });

    if (matchedAll) scored.push({ product, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.product);
}

export type SortKey = 'onerilen' | 'fiyat-artan' | 'fiyat-azalan' | 'isim';

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'onerilen', label: 'Önerilen' },
  { key: 'fiyat-artan', label: 'Artan fiyat' },
  { key: 'fiyat-azalan', label: 'Azalan fiyat' },
  { key: 'isim', label: 'İsim' },
];

/* "Taksit imkânı" is offered only when instalments can actually be paid —
   filtering by a promise the checkout cannot keep would be worse than not
   offering the filter. */
export const FEATURES: readonly { key: 'kargo' | 'taksit' | 'indirim'; label: string }[] = [
  { key: 'kargo', label: 'Ücretsiz kargo' },
  ...(INSTALMENTS_AVAILABLE ? [{ key: 'taksit' as const, label: 'Taksit imkânı' }] : []),
  { key: 'indirim', label: 'İndirimli ürünler' },
];

/** Fixed bands rather than computed ones: a bucket that moves as the result set
 *  changes is impossible to aim at twice. */
export const PRICE_BANDS = [
  { key: '0-500', label: '500 ₺ altı', min: 0, max: 500 },
  { key: '500-2000', label: '500 – 2.000 ₺', min: 500, max: 2000 },
  { key: '2000-10000', label: '2.000 – 10.000 ₺', min: 2000, max: 10000 },
  { key: '10000-0', label: '10.000 ₺ ve üzeri', min: 10000, max: 0 },
];

export type SearchParams = Record<string, string | string[] | undefined>;

export interface CatalogFilters {
  brands: string[];
  band?: string;
  min?: number;
  max?: number;
  inStock: boolean;
  features: string[];
  sort: SortKey;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const asList = (value: string | string[] | undefined) =>
  (first(value) ?? '')
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

export function parseFilters(params: SearchParams): CatalogFilters {
  const band = PRICE_BANDS.find((item) => item.key === first(params.fiyat));
  const sortRaw = first(params.siralama) as SortKey | undefined;
  const sort = SORTS.some((item) => item.key === sortRaw) ? (sortRaw as SortKey) : 'onerilen';

  return {
    brands: asList(params.marka),
    band: band?.key,
    min: band && band.min > 0 ? band.min : undefined,
    max: band && band.max > 0 ? band.max : undefined,
    inStock: first(params.stok) === '1',
    features: asList(params.ozellik).filter((key) =>
      FEATURES.some((feature) => feature.key === key),
    ),
    sort,
  };
}

export function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  const matched = products.filter((product) => {
    if (filters.brands.length && !filters.brands.includes(brandSlug(product.brand))) {
      return false;
    }
    // A price range is a filter on prices: price-on-request products leave it.
    if (filters.min !== undefined && (product.price == null || product.price < filters.min)) return false;
    if (filters.max !== undefined && (product.price == null || product.price > filters.max)) return false;
    if (filters.inStock && product.stock === 0) return false;

    for (const feature of filters.features) {
      if (feature === 'kargo' && !product.freeShipping) return false;
      if (feature === 'taksit' && !product.instalment) return false;
      if (feature === 'indirim' && !product.compareAtPrice) return false;
    }
    return true;
  });

  switch (filters.sort) {
    // Price-on-request products sort after every priced one, either way.
    case 'fiyat-artan':
      return [...matched].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'fiyat-azalan':
      return [...matched].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case 'isim':
      return [...matched].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    default:
      return matched;
  }
}

/**
 * Facet counts.
 *
 * Brand counts are computed with every filter applied EXCEPT the brand filter
 * itself — otherwise selecting one brand would show every other brand as "0"
 * and the list could never be widened again.
 */
export function facetsOf(scope: Product[], filters: CatalogFilters) {
  const withoutBrand = applyFilters(scope, { ...filters, brands: [] });

  const brands = new Map<string, { slug: string; label: string; count: number }>();
  for (const product of withoutBrand) {
    const slug = brandSlug(product.brand);
    const entry = brands.get(slug) ?? { slug, label: product.brand, count: 0 };
    entry.count += 1;
    brands.set(slug, entry);
  }

  const withoutBand = applyFilters(scope, { ...filters, band: undefined, min: undefined, max: undefined });
  const withoutFeatures = applyFilters(scope, { ...filters, features: [], inStock: false });

  return {
    brands: [...brands.values()].sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr'),
    ),
    bands: PRICE_BANDS.map((band) => ({
      ...band,
      count: withoutBand.filter(
        (product) =>
          product.price != null &&
          product.price >= band.min &&
          (band.max === 0 || product.price <= band.max),
      ).length,
    })),
    inStock: withoutFeatures.filter((product) => product.stock > 0).length,
    features: FEATURES.map((feature) => ({
      ...feature,
      count: withoutFeatures.filter((product) =>
        feature.key === 'kargo'
          ? product.freeShipping
          : feature.key === 'taksit'
            ? product.instalment
            : Boolean(product.compareAtPrice),
      ).length,
    })),
  };
}

/** How many filters are actually narrowing the list — drives the mobile badge. */
export const activeCount = (filters: CatalogFilters) =>
  filters.brands.length +
  filters.features.length +
  (filters.band ? 1 : 0) +
  (filters.inStock ? 1 : 0);

/** Build a URL by patching parameters; an empty value removes one. */
export function hrefWith(
  base: string,
  params: SearchParams,
  patch: Record<string, string | undefined>,
): string {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const single = first(value);
    if (single) next.set(key, single);
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === '') next.delete(key);
    else next.set(key, value);
  }
  const query = next.toString();
  return query ? `${base}?${query}` : base;
}

/** Toggle one value inside a comma-separated parameter. */
export function toggled(current: string[], value: string): string | undefined {
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return next.length ? next.join(',') : undefined;
}
