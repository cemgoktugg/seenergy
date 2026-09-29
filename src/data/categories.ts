/**
 * The category tree — the client's own, written out by hand on 2026-09-29:
 * fourteen top-level categories, three of them with subcategories.
 *
 * This is the ONE place the storefront learns what categories exist. The nav
 * bar, the mega panel, the mobile drawer, the homepage board, the footer, the
 * /kategori index, category pages, breadcrumbs and the spec-template lookup
 * all derive from it, where there used to be a hand-written 12-item nav with
 * invented sub-links beside a separate 12-key category map.
 *
 * `slug` is the route AND the Medusa category handle — the handles are
 * created by backend/apps/backend/src/migration-scripts/security-category-
 * tree.ts. Change one, change both.
 *
 * Pure data, no imports: safe in client components.
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

export const CATEGORY_TREE: CategoryNode[] = [
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

/** Every category, parents and children, with its parent's slug. */
export const ALL_CATEGORIES: (CategoryNode & { parent?: string })[] = CATEGORY_TREE.flatMap((node) => [
  node,
  ...(node.children ?? []).map((child) => ({ ...child, parent: node.slug, spec: child.spec ?? node.spec })),
]);
