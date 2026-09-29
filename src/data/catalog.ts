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
  /** The admin's free-text description; empty when none was written. */
  description: string;
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

/**
 * Category keys carry a Turkish label and a route, so a breadcrumb and a spec
 * row never have to re-derive either from the key. The route slug is also the
 * Medusa category handle — that is how a Medusa category maps back to a key.
 */
export const CATEGORY_META: Record<string, { label: string; href: string }> = {
  uydu: { label: 'Uydu Sistemleri', href: '/kategori/uydu-sistemleri' },
  kumanda: { label: 'Kumanda Çeşitleri', href: '/kategori/kumanda-cesitleri' },
  ses: { label: 'Seslendirme Sistemleri', href: '/kategori/seslendirme-sistemleri' },
  guvenlik: { label: 'Güvenlik Sistemleri', href: '/kategori/guvenlik-sistemleri' },
  led: { label: 'Led ve Aydınlatma', href: '/kategori/led-aydinlatma' },
  adaptor: { label: 'Adaptör, Akü, Pil', href: '/kategori/adaptor-aku-pil' },
  oto: { label: 'Oto Ses ve Görüntü', href: '/kategori/oto-ses-goruntu' },
  oem: { label: 'Oem ve Çevre Birimleri', href: '/kategori/oem-cevre-birimleri' },
  olcum: { label: 'Ölçü Aletleri', href: '/kategori/olcu-aletleri' },
  kablo: { label: 'Kablo Çeşitleri', href: '/kategori/kablo-cesitleri' },
  bilgisayar: { label: 'Bilgisayar ve Monitör', href: '/kategori/bilgisayar' },
  hirdavat: { label: 'Hırdavat ve Tamir Malzemeleri', href: '/kategori/hirdavat-tamir' },
};

export const categoryMeta = (category: string) =>
  CATEGORY_META[category] ?? { label: 'Tüm Ürünler', href: '/kategori' };

/** Medusa category handle → catalogue key. */
export const categoryKeyFromHandle = (handle: string): string | undefined =>
  Object.entries(CATEGORY_META).find(([, meta]) => meta.href === `/kategori/${handle}`)?.[0];

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
  const byCategory = (category: string): Product[] =>
    products.filter((product) => product.category === category);

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
