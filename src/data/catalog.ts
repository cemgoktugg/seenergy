/**
 * Catalogue model and the pure helpers over it.
 *
 * Products live in Medusa now (see `src/lib/medusa/catalog.ts`, which loads
 * them and maps them onto `Product`). This module deliberately holds no data
 * and no I/O, so client components can keep importing the type, the price
 * formatter and the index without pulling the Medusa client into a browser
 * bundle.
 *
 * Rating fields are explicitly mock and are never emitted as structured data.
 */

import { ALL_CATEGORIES, categoryHref } from '@/data/categories';

export interface Product {
  id: string;
  /** The one variant every catalogue product has — what a cart line points at. */
  variantId: string;
  slug: string;
  brand: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  /** The main picture — what cards, rows and the cart show. */
  image: string;
  /** Every picture, in the order the admin set, main first. Never empty. */
  images: string[];
  stock: number;
  freeShipping: boolean;
  instalment: boolean;
  badge?: 'super-firsat' | 'yeni' | 'cok-satan';
  /** Mock only — never rendered into JSON-LD. */
  ratingMock: number;
  reviewCountMock: number;
}

/** Orders from this amount ship free — mirrors the backend's Standart Kargo rule. */
export const FREE_SHIPPING_FROM = 1000;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export interface CategoryMeta {
  label: string;
  href: string;
  /** The parent category's key, for a subcategory. */
  parent?: string;
  /** Subcategory keys, in the client's order. */
  children: string[];
  /** The spec template key (src/data/specs.ts), inherited by subcategories. */
  spec?: string;
}

/**
 * Every category by key, derived from the one tree in src/data/categories.ts.
 * A key IS the route slug and the Medusa category handle, so a breadcrumb, a
 * spec lookup and a Medusa category all meet on the same string.
 */
export const CATEGORY_META: Record<string, CategoryMeta> = Object.fromEntries(
  ALL_CATEGORIES.map((node) => [
    node.slug,
    {
      label: node.label,
      href: categoryHref(node.slug),
      parent: node.parent,
      children: (node.children ?? []).map((child) => child.slug),
      spec: node.spec,
    },
  ]),
);

/** A product the tree has no place for (key '') lands on the full index. */
export const categoryMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category] ?? { label: 'Tüm Kategoriler', href: '/kategori', children: [] };

/** Medusa category handle → catalogue key: the same string, when it is ours. */
export const categoryKeyFromHandle = (handle: string): string | undefined =>
  handle in CATEGORY_META ? handle : undefined;

/** A category and its subcategories — what a category page lists. */
export const categoryAndChildren = (category: string): string[] => [
  category,
  ...(CATEGORY_META[category]?.children ?? []),
];

/**
 * One brand → one slug, everywhere. The product slugifier is reused rather than
 * a second lowercase-and-strip rule, so `Sesyapı` resolves to `sesyapi` in a
 * link, a filter and a route alike instead of three different spellings.
 */
export const brandSlug = (brand: string): string => slugify(brand);

/**
 * Discount percentage is DERIVED, never authored (docs/COMMERCE_RULES §5), so
 * it can never disagree with the two prices printed beside it.
 */
export const discountPercent = (product: Product): number | null =>
  product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value);

/**
 * The lookups every page uses, bound to one loaded product list.
 *
 * They were module-level functions over a static array; they keep their names
 * and semantics so a page changes one import line, not its logic. Order is the
 * list's order, which the loader keeps stable — the homepage rails and the
 * visual baselines depend on it.
 */
export function indexCatalog(products: Product[]) {
  const byBrand = (brand: string, count?: number): Product[] => {
    const list = products.filter((product) => product.brand === brand);
    return count === undefined ? list : list.slice(0, count);
  };
  /* A top-level category lists its subcategories' products as well. */
  const byCategory = (category: string): Product[] => {
    const keys = new Set(categoryAndChildren(category));
    return products.filter((product) => keys.has(product.category));
  };

  return {
    products,
    brands: [...new Set(products.map((product) => product.brand))],

    /** Lookup by id — what favourites and compare lists store. */
    byId: (id: string): Product | undefined => products.find((product) => product.id === id),
    bySlug: (slug: string): Product | undefined =>
      products.find((product) => product.slug === slug),

    brandFromSlug: (slug: string): string | undefined =>
      products.find((product) => brandSlug(product.brand) === slug)?.brand,
    byBrandSlug: (slug: string): Product[] =>
      products.filter((product) => brandSlug(product.brand) === slug),
    byBrand,

    byCategory,
    takeFrom: (category: string, count: number): Product[] =>
      byCategory(category).slice(0, count),

    /**
     * The other models of the same brand — the product page's most important
     * rail. Excludes the product being viewed, keeps list order, and falls back
     * to an empty list rather than padding with other brands: "diğer modeller"
     * has to mean what it says.
     */
    otherModelsOf: (product: Product, count = 8): Product[] =>
      products
        .filter((item) => item.brand === product.brand && item.id !== product.id)
        .slice(0, count),

    /** Same category, different brand — the secondary rail. */
    alternativesTo: (product: Product, count = 5): Product[] =>
      products
        .filter((item) => item.category === product.category && item.brand !== product.brand)
        .slice(0, count),

    /** Deterministic "mixed" selection used by the multi-category rails. */
    mixed: (offset: number, count: number): Product[] => {
      const out: Product[] = [];
      if (products.length === 0) return out;
      for (let i = 0; i < count; i += 1) {
        out.push(products[(offset + i * 5) % products.length]);
      }
      return out;
    },
  };
}

export type Catalog = ReturnType<typeof indexCatalog>;
