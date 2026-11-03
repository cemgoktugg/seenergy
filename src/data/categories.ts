/**
 * The category tree.
 *
 * Since 2026-11-03 it is Medusa's: the shop adds and deletes categories in the
 * admin (Vitrin → Ürün Yönetimi), and `loadCategoryTree()`
 * (src/lib/medusa/categories.ts) reads the active ones and installs them here
 * with `setCategoryTree()` before anything renders from them — `loadCatalog()`
 * does that on every server render, so a page that has loaded the catalogue
 * reads the live tree. DEFAULT_CATEGORY_TREE below — the client's own, written
 * out by hand on 2026-09-29 — is what is used until then, and what a browser
 * bundle sees; client components get the tree as props instead (the header's
 * `nav`).
 *
 * This is the ONE place the storefront learns what categories exist. The nav
 * bar, the mega panel, the mobile drawer, the footer, the /kategori index,
 * category pages, breadcrumbs and the spec-template lookup all derive from it.
 *
 * `slug` is the route AND the Medusa category handle.
 *
 * No imports: safe in client components.
 */

export interface CategoryNode {
  /** Route slug, Medusa handle and catalogue key in one. */
  slug: string;
  label: string;
  /** A shorter label for the nav bar, where fourteen items share one row. */
  short?: string;
  /** The CATEGORY_SPECS template (src/data/specs.ts) its products fall back
   *  to. Subcategories inherit their parent's. None = no template. */
  spec?: string;
  children?: CategoryNode[];
}

export const DEFAULT_CATEGORY_TREE: CategoryNode[] = [
  {
    slug: 'cctv-guvenlik-sistemleri',
    label: 'CCTV Güvenlik Sistemleri',
    short: 'CCTV Güvenlik',
    spec: 'guvenlik',
    children: [
      { slug: 'ahd-sistem', label: 'AHD Sistem' },
      { slug: 'ip-sistem', label: 'IP Sistem' },
      { slug: 'wifi-kameralar', label: 'WiFi Kameralar' },
      { slug: 'solar-kameralar', label: 'Solar Kameralar' },
    ],
  },
  { slug: 'arac-kameralari', label: 'Araç Kameraları' },
  { slug: 'kayit-ve-depolama', label: 'Kayıt ve Depolama', spec: 'guvenlik' },
  {
    slug: 'network-urunleri',
    label: 'Network Ürünleri',
    spec: 'oem',
    children: [
      { slug: 'ethernet-switch', label: 'Ethernet Switch' },
      { slug: 'poe-switch', label: 'PoE Switch' },
      { slug: 'access-point-router', label: 'Access Point / Router' },
    ],
  },
  { slug: 'yangin-algilama-sistemleri', label: 'Yangın Algılama Sistemleri', short: 'Yangın Algılama' },
  { slug: 'alarm-sistemleri', label: 'Alarm Sistemleri' },
  {
    slug: 'uydu-sistemleri',
    label: 'Uydu Sistemleri',
    spec: 'uydu',
    children: [
      { slug: 'uydu-alicisi', label: 'Uydu Alıcısı' },
      { slug: 'uydu-santrali', label: 'Uydu Santrali' },
      { slug: 'lnb', label: 'LNB' },
      { slug: 'uydu-aksesuarlari', label: 'Uydu Aksesuarları' },
      { slug: 'anten', label: 'Anten' },
    ],
  },
  { slug: 'rack-kabinetler', label: 'Rack Kabinetler' },
  { slug: 'aksesuarlar', label: 'Aksesuarlar' },
  { slug: 'elektronik-kilit-sistemleri', label: 'Elektronik Kilit Sistemleri', short: 'Elektronik Kilit' },
  { slug: 'gecis-kontrol-sistemleri', label: 'Geçiş Kontrol Sistemleri', short: 'Geçiş Kontrol' },
  { slug: 'interkom-sistemleri', label: 'İnterkom Sistemleri', short: 'İnterkom' },
  { slug: 'seslendirme-sistemleri', label: 'Seslendirme Sistemleri', spec: 'ses' },
  { slug: 'monitor', label: 'Monitör' },
];

export const categoryHref = (slug: string) => `/kategori/${slug}`;

export type FlatCategory = CategoryNode & { parent?: string };

const flatten = (tree: CategoryNode[]): FlatCategory[] =>
  tree.flatMap((node) => [
    node,
    ...(node.children ?? []).map((child) => ({ ...child, parent: node.slug, spec: child.spec ?? node.spec })),
  ]);

let current = { tree: DEFAULT_CATEGORY_TREE, all: flatten(DEFAULT_CATEGORY_TREE), key: '', version: 0 };

/** Install the live tree (server side, from loadCategoryTree). */
export function setCategoryTree(tree: CategoryNode[]): void {
  const key = JSON.stringify(tree);
  if (key === current.key) return;
  current = { tree, all: flatten(tree), key, version: current.version + 1 };
}

/** The top-level categories, each with its subcategories. */
export const categoryTree = (): CategoryNode[] => current.tree;

/** Every category, parents and children, with its parent's slug. */
export const allCategories = (): FlatCategory[] => current.all;

/** Bumped by every setCategoryTree, for lookups derived from the tree. */
export const categoryTreeVersion = (): number => current.version;
