import { cache } from 'react';

import {
  FREE_SHIPPING_FROM,
  categoryKeyFromHandle,
  indexCatalog,
  type Catalog,
  type Product,
} from '@/data/catalog';
import type { SpecGroup } from '@/data/specs';
import { medusa } from '@/lib/medusa/client';

/**
 * Load the catalogue from Medusa and map it onto the storefront's `Product`.
 *
 * The whole published catalogue is fetched in one request and filtered in
 * memory. At 59 products that is cheaper than a request per rail, and it keeps
 * `src/lib/catalog-query.ts` — filters, facets, search ranking — unchanged.
 * When the catalogue outgrows one page, move filtering into Store API queries.
 *
 * Caching: Next's data cache holds the response for REVALIDATE seconds, so an
 * edit in the Medusa admin reaches the storefront within a minute without a
 * rebuild; React's `cache` dedupes the call within one render.
 */

const REVALIDATE = 60;
export const CATALOG_TAG = 'catalog';

interface StoreRegion {
  id: string;
  currency_code: string;
}

interface StoreProduct {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  images: { url: string; rank?: number | null }[] | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
  collection: { title: string } | null;
  categories: { handle: string }[] | null;
  variants: {
    id: string;
    sku: string | null;
    inventory_quantity?: number | null;
    manage_inventory?: boolean;
    calculated_price?: {
      calculated_amount: number | null;
      original_amount: number | null;
    } | null;
  }[];
}

export const getRegion = cache(async (): Promise<StoreRegion> => {
  const { regions } = await medusa<{ regions: StoreRegion[] }>('/store/regions', {
    next: { revalidate: 3600, tags: ['region'] },
  });
  const region = regions.find((item) => item.currency_code === 'try') ?? regions[0];
  if (!region) throw new Error('Medusa has no region — run the backend seed.');
  return region;
});

const FIELDS = [
  'id',
  'handle',
  'title',
  'description',
  'thumbnail',
  '*images',
  'created_at',
  'metadata',
  '*collection',
  '*categories',
  '*variants.calculated_price',
  '+variants.sku',
  '+variants.inventory_quantity',
].join(',');

/**
 * Seeded images are absolute URLs back to this storefront's own /mock assets.
 * Served as root-relative paths they keep working on any host; an image
 * uploaded in the admin keeps its absolute URL.
 */
function imagePath(thumbnail: string | null): string {
  if (!thumbnail) return '/mock/products/receiver-black.svg';
  try {
    const url = new URL(thumbnail);
    return url.pathname.startsWith('/mock/') ? url.pathname : thumbnail;
  } catch {
    return thumbnail;
  }
}

/**
 * Every picture, main first. The thumbnail leads — it is what the admin marked
 * as the main image — followed by the rest of the gallery in the admin's order,
 * without repeating it.
 */
function galleryOf(product: StoreProduct): string[] {
  const ordered = [...(product.images ?? [])]
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((image) => imagePath(image.url));
  const main = imagePath(product.thumbnail ?? product.images?.[0]?.url ?? null);
  return [main, ...ordered.filter((url) => url !== main)];
}

const BADGES = new Set(['super-firsat', 'yeni', 'cok-satan']);

/** "p-007" → 6: the seed index the mock rating and the list order derive from. */
const legacyIndex = (product: StoreProduct): number => {
  const match = /^p-(\d+)$/.exec(String(product.metadata?.legacy_id ?? ''));
  return match ? Number(match[1]) - 1 : Number.POSITIVE_INFINITY;
};

function toProduct(product: StoreProduct, index: number): Product | null {
  const variant = product.variants[0];
  if (!variant) return null;
  // No price yet: kept, and shown as price-on-request (see Product.price).
  const amount = variant.calculated_price?.calculated_amount ?? null;
  const original = variant.calculated_price?.original_amount ?? amount;
  const meta = product.metadata ?? {};
  const badge = typeof meta.badge === 'string' && BADGES.has(meta.badge) ? meta.badge : undefined;

  return {
    id: product.id,
    variantId: variant.id,
    slug: product.handle,
    brand: String(meta.brand ?? product.collection?.title ?? ''),
    name: product.title,
    sku: variant.sku ?? '',
    category: categoryKeyFromHandle(product.categories?.[0]?.handle ?? '') ?? '',
    price: amount,
    compareAtPrice: amount != null && original != null && original > amount ? original : undefined,
    image: imagePath(product.thumbnail),
    images: galleryOf(product),
    // An untracked variant is always available; a tracked one reports its stock.
    stock: variant.manage_inventory === false ? 999 : Math.max(0, variant.inventory_quantity ?? 0),
    freeShipping: amount != null && amount >= FREE_SHIPPING_FROM,
    instalment: meta.instalment === true,
    badge: badge as Product['badge'],
    // Deterministic pseudo-values, clearly labelled as mock.
    ratingMock: 3.6 + ((index * 13) % 14) / 10,
    reviewCountMock: 4 + ((index * 17) % 180),
  };
}

/** The raw Store API response, shared by the catalogue and the details. */
const loadStoreProducts = cache(async (): Promise<StoreProduct[]> => {
  try {
    const region = await getRegion();
    const { products } = await medusa<{ products: StoreProduct[] }>('/store/products', {
      query: { limit: 500, region_id: region.id, fields: FIELDS },
      next: { revalidate: REVALIDATE, tags: [CATALOG_TAG] },
    });
    return products;
  } catch (error) {
    /* Docker Compose builds every image before it starts any container, so
       on a first deploy the storefront image is built while the backend is
       not running yet. Only then (the Dockerfile sets SEENERGY_IMAGE_BUILD
       for that one step) the pages prerender without the catalogue: no
       product page is pre-generated, and the rest revalidate within
       REVALIDATE seconds once the backend answers. Anywhere else a failure
       stays a failure — a live page must not quietly show an empty shop. */
    if (process.env.SEENERGY_IMAGE_BUILD === '1') {
      console.warn('[seenergy] Medusa unreachable during the image build; prerendering without the catalogue.');
      return [];
    }
    throw error;
  }
});

export const loadProducts = cache(async (): Promise<Product[]> => {
  const products = await loadStoreProducts();

  // Seeded products keep their original seed order; products added later in
  // the admin follow, oldest first.
  const ordered = [...products].sort(
    (a, b) => legacyIndex(a) - legacyIndex(b) || a.created_at.localeCompare(b.created_at),
  );

  return ordered
    .map((product, position) => {
      const index = legacyIndex(product);
      return toProduct(product, Number.isFinite(index) ? index : position);
    })
    .filter((product): product is Product => product !== null);
});

/** The catalogue plus its lookups — `const { bySlug } = await loadCatalog()`. */
export const loadCatalog = cache(async (): Promise<Catalog> => indexCatalog(await loadProducts()));

/**
 * What only the product page reads: the admin's description and the
 * product's own specification groups. Kept out of `Product` on purpose —
 * every card on a listing page serialises its Product to the client, and a
 * long description or a 20-row spec sheet would ride along on all of them.
 */
export interface ProductDetails {
  description: string;
  /** Empty when the admin has not written any: the page falls back to the
   *  category's template and says so. */
  specs: SpecGroup[];
  /** The manufacturer's datasheet (PDF), when one was uploaded. */
  datasheet: string | null;
}

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/**
 * `metadata.specs` is written by the admin's product form, but metadata is
 * free-form JSON anyone can edit in Medusa's own screens, so it is validated
 * here rather than trusted: malformed groups and empty rows are dropped.
 */
export function specsFrom(value: unknown): SpecGroup[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((group) => {
      const rows = Array.isArray(group?.rows) ? group.rows : [];
      return {
        title: str(group?.title),
        rows: rows
          .map((row: unknown) => {
            const r = row as Record<string, unknown> | null;
            const note = str(r?.note);
            return { label: str(r?.label), value: str(r?.value), ...(note ? { note } : {}) };
          })
          .filter((row: { label: string; value: string }) => row.label && row.value),
      };
    })
    .filter((group) => group.title && group.rows.length > 0);
}

export const loadProductDetails = cache(async (id: string): Promise<ProductDetails> => {
  const product = (await loadStoreProducts()).find((item) => item.id === id);
  return {
    description: str(product?.description),
    specs: specsFrom(product?.metadata?.specs),
    datasheet: str(product?.metadata?.datasheet_url) || null,
  };
});
