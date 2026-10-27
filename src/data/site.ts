/**
 * Site chrome data: navigation, utility links, footer, brands.
 * Our own brand identity — nothing here is taken from the reference site.
 */

import { ALL_CATEGORIES, CATEGORY_TREE, categoryHref } from '@/data/categories';

export const SITE = {
  name: 'SEENERGY',
  shortName: 'SEENERGY',
  /* The logo's own line: "SEENERGY Güvenlik Teknolojileri A.Ş". */
  tagline: 'Güvenlik Teknolojileri',
  promo: '1000 TL ÜZERİ ÜCRETSİZ KARGO',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  /** The nav-bar label: fourteen items share one row. `label` elsewhere. */
  short: string;
  href: string;
  /** Subcategories — the mega panel and the drawer's accordion. */
  children?: NavLink[];
}

/**
 * The fourteen top-level categories, straight from the category tree
 * (src/data/categories.ts).
 *
 * This replaced a hand-written twelve-item nav whose mega panels carried five
 * columns of sub-links per category, invented to fill a measured panel —
 * nearly all of them pointing at categories the catalogue never had. A mega
 * panel now opens only where a category really has subcategories.
 */
export const PRIMARY_NAV: NavItem[] = CATEGORY_TREE.map((node) => ({
  label: node.label,
  short: node.short ?? node.label,
  href: categoryHref(node.slug),
  children: node.children?.map((child) => ({ label: child.label, href: categoryHref(child.slug) })),
}));

/**
 * The categories the nav bar names on one line, in order. Fourteen two-line
 * labels made a cramped bar; the full tree lives behind "Tüm Kategoriler".
 * The bar shows the first five at 1200, six from 1280 and all seven from 1440.
 */
export const NAV_FEATURED = [
  '/kategori/cctv-guvenlik-sistemleri',
  '/kategori/kayit-ve-depolama',
  '/kategori/network-urunleri',
  '/kategori/uydu-sistemleri',
  '/kategori/alarm-sistemleri',
  '/kategori/yangin-algilama-sistemleri',
  '/kategori/gecis-kontrol-sistemleri',
];

export const UTILITY_LINKS = [
  { label: 'Hakkımızda', href: '/hakkimizda', icon: 'info' as const },
  { label: 'İletişim', href: '/iletisim', icon: 'phone' as const },
  { label: 'Toptan Sipariş', href: '/toptan-satis', icon: 'truck' as const },
  { label: 'Yetkili Satıcımız Olun', href: '/bayi-basvurusu', icon: 'badge' as const },
];

/**
 * Category promo tiles.
 *
 * `image` is the tile background, `product` is the device shown on the right —
 * the reference tiles are half graphic panel, half product shot, and a tile
 * without the product reads as an empty placeholder.
 */
export interface CategoryTile {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  product: string;
}

/* `product` points at the transparent cutout, not the plated product image:
   these tiles have coloured backgrounds and the plated version shows its white
   plate as a box on them. */
export const CATEGORY_TILES: CategoryTile[] = [
  { title: 'Uydu', subtitle: 'Sistemleri', href: '/kategori/uydu-sistemleri', image: '/mock/categories/uydu-sistemleri.svg', product: '/mock/products/cutout/receiver-graphite.svg' },
  { title: 'Profesyonel', subtitle: 'Ses Sistemleri', href: '/kategori/seslendirme-sistemleri', image: '/mock/categories/ses-sistemleri.svg', product: '/mock/products/cutout/speaker-black.svg' },
  { title: 'Tv Led Bar', subtitle: 'Çeşitleri', href: '/kategori/led-bar', image: '/mock/categories/led-aydinlatma.svg', product: '/mock/products/cutout/ledbar-silver.svg' },
  { title: 'Ev ve Yaşam', subtitle: 'Ürünleri', href: '/kategori/ev-yasam-teknoloji', image: '/mock/categories/ev-teknolojileri.svg', product: '/mock/products/cutout/router-white.svg' },
];

export const CATEGORY_TILES_SECONDARY: CategoryTile[] = [
  { title: 'Elektronik', subtitle: 'Malzemeler', href: '/kategori/hirdavat-tamir', image: '/mock/categories/elektronik-malzemeler.svg', product: '/mock/products/cutout/meter-graphite.svg' },
  { title: 'Fener & Işıldak', subtitle: 'Çeşitleri', href: '/kategori/fener-isildak', image: '/mock/categories/fener-isildak.svg', product: '/mock/products/cutout/adapter-silver.svg' },
  { title: 'Ölçü Aleti', subtitle: 'Çeşitleri', href: '/kategori/olcu-aletleri', image: '/mock/categories/olcu-aletleri.svg', product: '/mock/products/cutout/meter-black.svg' },
  { title: 'Güvenlik', subtitle: 'Sistemleri', href: '/kategori/guvenlik-sistemleri', image: '/mock/categories/guvenlik-sistemleri.svg', product: '/mock/products/cutout/camera-white.svg' },
];

/**
 * Hero slides.
 *
 * `chips` are three short, concrete facts per slide — what the category
 * actually covers. Every one of them is already claimed elsewhere on this site
 * (the catalogue's own categories, the 13.000+ figure in the campaign banner,
 * the installation support named in the editorial block), because a hero is
 * the worst place to invent a promise the rest of the site cannot keep.
 */
/**
 * The two tiles stacked beside the hero from `dt` up.
 *
 * Both destinations already exist on this site and both claims are already
 * made elsewhere on the homepage — the campaign tile in band 07 and the b2b
 * badge in the masthead. Nothing here is a new promise: a hero is the worst
 * place to invent one, and a secondary tile beside it is the second worst.
 *
 * They are the two most valuable non-category entry points a technical
 * storefront has: what is discounted, and how a business buys.
 */
/* Campaign cards: a brand tone and a product, not the sound-wave artwork that
   used to sit behind every banner on the page. Fallback only — the live
   content comes from admin → Vitrin → Slayt yanı kartlar. */
export const HERO_SIDE = [
  {
    eyebrow: 'Kampanya',
    title: 'Süper Fırsat Ürünleri',
    href: '/kampanyalar',
    tone: 'mor' as const,
    productImage: '/mock/products/cutout/speaker-white.svg',
  },
  {
    eyebrow: 'Kurumsal',
    title: 'Toptan alım ve bayilik',
    href: '/toptan-satis',
    tone: 'turkuaz' as const,
    productImage: '/mock/products/cutout/nvr-white.svg',
  },
];

export const HERO_SLIDES = [
  {
    eyebrow: "SEENERGY Güvenlik Teknolojileri",
    title: "Güvenlik Teknolojileri",
    description: "CCTV, kayıt, network, alarm ve geçiş kontrol ürünleri tek çatıda.",
    chips: ["CCTV ve kayıt", "Network ve PoE", "Alarm ve geçiş kontrol"],
    cta: "Kategorileri Gör",
    href: "/kategori",
    image: "/hero/seenergy-cctv.webp",
    fit: "contain",
  },
  {
    eyebrow: 'Seslendirme sistemleri',
    title: 'Profesyonel Ses',
    description: 'Sahne ve mekân seslendirmesinde toptan fiyat avantajı.',
    chips: ['Anfi ve mikser', 'Tavan ve kolon hoparlör', 'Toptan fiyat'],
    cta: 'Ürünleri İncele',
    href: '/kategori/seslendirme-sistemleri',
    image: '/mock/hero/hero-2.svg',
    fit: 'cover',
  },
  {
    eyebrow: "Network ürünleri",
    title: "Network ve PoE Çözümleri",
    description: "IP kamera sistemleri için PoE switch, ethernet switch, access point ve router.",
    chips: ["PoE Switch", "Ethernet Switch", "Access Point / Router"],
    cta: "Ürünleri İncele",
    href: "/kategori/network-urunleri",
    image: "/mock/products/cutout/router-white.svg",
    fit: "contain",
  },
];

/* Each post shows the product it is about, on a brand tone — the same
   campaign-card language as the banners, instead of four tints of one
   sound-wave drawing. No 'koyu': these sit in the dark chrome band, where a
   dark card has nothing to stand out from. */
export const BLOG_POSTS = [
  { title: 'Adaptör Nedir? Adaptör Çeşitleri Nelerdir?', href: '/blog/adaptor-nedir', image: '/mock/products/cutout/adapter-white.svg', tone: 'turkuaz' as const },
  { title: 'Access Point ve Router Arasındaki Farklar Nelerdir?', href: '/blog/access-point-router', image: '/mock/products/cutout/router-white.svg', tone: 'mor' as const },
  { title: 'ABS Plastik Nedir? Nerelerde Kullanılır?', href: '/blog/abs-plastik-nedir', image: '/mock/products/cutout/nvr-silver.svg', tone: 'acik' as const },
  { title: 'Akıllı Kumanda Nasıl Sıfırlanır?', href: '/blog/akilli-kumanda-sifirlama', image: '/mock/products/cutout/remote-white.svg', tone: 'turkuaz' as const },
];

/**
 * The brand wall (the homepage's moving logo rows) — the client's own list and
 * logos (src/markalarr, 2026-10-27), trimmed and converted into
 * public/brands/<slug>.webp. It replaced 45 generated placeholder names.
 *
 * `width` / `height` are the drawn size: every logo gets the same area
 * (~3400 px², at most 40 tall and 150 wide), so a long wordmark like Paradox
 * and a square badge like HES read as equals. `href` is the brand page; a
 * brand without products there opens the "çok yakında" quote panel.
 */
export const BRANDS = [
  { name: 'SEENERGY', slug: 'seenergy', width: 123, height: 28 },
  { name: 'SEENERGY Home', slug: 'seenergy-home', width: 127, height: 27 },
  { name: 'Racksan', slug: 'racksan', width: 99, height: 34 },
  { name: 'Dahua', slug: 'dahua', width: 107, height: 32 },
  { name: 'Hikvision', slug: 'hikvision', width: 150, height: 19 },
  { name: 'UNV', slug: 'unv', width: 80, height: 40 },
  { name: 'Neutron', slug: 'neutron', width: 150, height: 22 },
  { name: 'Ruijie', slug: 'ruijie', width: 107, height: 32 },
  { name: 'TP-Link', slug: 'tp-link', width: 95, height: 36 },
  { name: 'Teknim', slug: 'teknim', width: 122, height: 28 },
  { name: 'Paradox', slug: 'paradox', width: 150, height: 13 },
  { name: 'Karel', slug: 'karel', width: 109, height: 31 },
  { name: 'Audio', slug: 'audio', width: 102, height: 33 },
  { name: 'Huawei', slug: 'huawei', width: 125, height: 27 },
  { name: 'Sismik', slug: 'sismik', width: 101, height: 34 },
  { name: 'Gold Audio', slug: 'gold-audio', width: 143, height: 24 },
  { name: 'Wöller', slug: 'woller', width: 74, height: 40 },
  { name: 'Westa', slug: 'westa', width: 125, height: 27 },
  { name: 'Tescom', slug: 'tescom', width: 132, height: 26 },
  { name: 'Dotvolt', slug: 'dotvolt', width: 102, height: 33 },
  { name: 'Ajax', slug: 'ajax', width: 130, height: 26 },
  { name: 'HES Cabling Systems', slug: 'hes', width: 58, height: 40 },
  { name: 'Öznur Kablo', slug: 'oznur-kablo', width: 87, height: 39 },
  { name: 'Reçber', slug: 'recber', width: 129, height: 26 },
  { name: 'Armağan Kablo', slug: 'armagan-kablo', width: 130, height: 26 },
  { name: 'Eleks', slug: 'eleks', width: 111, height: 31 },
  { name: 'Hi-Level', slug: 'hi-level', width: 148, height: 23 },
  { name: 'HiLook', slug: 'hilook', width: 113, height: 30 },
  { name: 'HPE', slug: 'hpe', width: 109, height: 31 },
  { name: 'Kioxia', slug: 'kioxia', width: 130, height: 26 },
  { name: 'Koç Kablo', slug: 'koc-kablo', width: 62, height: 40 },
  { name: 'MAG', slug: 'mag', width: 86, height: 39 },
  { name: 'T&Smart', slug: 't-smart', width: 117, height: 29 },
].map((brand) => ({ ...brand, href: `/marka/${brand.slug}`, image: `/brands/${brand.slug}.webp` }));

/**
 * Brand showcases — the seven homepage bands the client asked for, built on the
 * structure the "All In One Bilgisayarlar" band used, one per brand.
 *
 * `brand` is the catalogue key, so the band's products come from the catalogue
 * itself (`byBrand`) rather than a hand-maintained second list that could drift
 * out of sync with it. Every featured brand carries at least four products.
 */
export interface BrandSectionItem {
  brand: string;
  tagline: string;
  href: string;
  logo: string;
}

export const BRAND_SECTIONS: BrandSectionItem[] = [
  { brand: 'Tekniva', tagline: 'All in one bilgisayarlar ve monitörler', href: '/marka/tekniva', logo: '/mock/brands/tekniva.svg' },
  { brand: 'Orbisat', tagline: 'Uydu alıcıları ve santral sistemleri', href: '/marka/orbisat', logo: '/mock/brands/orbisat.svg' },
  { brand: 'Sonora', tagline: 'Profesyonel ses ve sahne sistemleri', href: '/marka/sonora', logo: '/mock/brands/sonora.svg' },
  { brand: 'Provista', tagline: 'Güvenlik kameraları ve kayıt cihazları', href: '/marka/provista', logo: '/mock/brands/provista.svg' },
  { brand: 'Ledora', tagline: 'Televizyon led bar ve panel yedek parçaları', href: '/marka/ledora', logo: '/mock/brands/ledora.svg' },
  { brand: 'Voltra', tagline: 'Oto ses, multimedya ve görüntü sistemleri', href: '/marka/voltra', logo: '/mock/brands/voltra.svg' },
  { brand: 'Kumandax', tagline: 'Televizyon, uydu ve klima kumandaları', href: '/marka/kumandax', logo: '/mock/brands/kumandax.svg' },
];

/**
 * The five product-page statements (docs/COMMERCE_RULES §12).
 *
 * CONFIGURABLE PLACEHOLDERS — deliberately so. Not one of them asserts a
 * certification, a guarantee percentage or an award, because none of that can
 * be substantiated from here. Replace the text, keep the restraint.
 */
export const PRODUCT_TRUST = [
  { icon: 'invoice' as const, label: 'Faturalı ürün' },
  { icon: 'badge' as const, label: 'Garanti kapsamında' },
  { icon: 'truck' as const, label: 'Kargoya aynı gün hazırlanır' },
  { icon: 'refresh' as const, label: '14 gün içinde iade' },
  { icon: 'support' as const, label: 'Teknik destek hattı' },
];

export const TRUST_ITEMS = [
  { title: 'Ücretsiz Kargo', subtitle: '1000 TL ve Üzeri Alışverişlerde', icon: 'truck' as const },
  // Was "Orijinal Ürünler — %100 Faturalı ve Garantili". Both halves broke
  // docs/COMMERCE_RULES §12: a guarantee percentage ("%100 …") is named there
  // as forbidden anywhere in the build, and "orijinal" asserts an authenticity
  // this project cannot substantiate. Restated to match PRODUCT_TRUST, which
  // already held the right tone.
  { title: 'Faturalı Ürün', subtitle: 'Garanti Kapsamında', icon: 'badge' as const },
  { title: 'Güvenli Alışveriş', subtitle: '256Bit SSL Koruması', icon: 'lock' as const },
  { title: 'Kolay İade', subtitle: '14 İş Günü İçinde', icon: 'refresh' as const },
];

/**
 * Measured: the reference's corporate footer is three link columns of 7 / 7 / 5
 * followed by a contact block on the right, not four even columns of five.
 */
export const FOOTER_COLUMNS = [
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'B2B Bayi Girişi', href: '/b2b-giris' },
      { label: 'Bayi Başvurusu', href: '/bayi-basvurusu' },
      { label: 'İş İlanları', href: '/is-ilanlari' },
      { label: 'İletişim', href: '/iletisim' },
      { label: 'Blog', href: '/blog' },
      { label: 'Toptan Satış', href: '/toptan-satis' },
    ],
  },
  {
    title: 'Müşteri İlişkileri',
    links: [
      { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
      { label: 'Gizlilik ve Güvenlik', href: '/gizlilik' },
      { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
      { label: 'İade ve Değişim Şartları', href: '/iade-degisim' },
      { label: 'Kişisel Verilerin Korunması', href: '/kvkk' },
      { label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { label: 'Sıkça Sorulan Sorular', href: '/sss' },
    ],
  },
  {
    title: 'Sipariş İşlemleri',
    links: [
      { label: 'Sipariş Takibi', href: '/siparis-takibi' },
      { label: 'Havale Bildirim Formu', href: '/havale-bildirim' },
      { label: 'Kargo ve Teslimat', href: '/kargo-teslimat' },
      { label: 'Garanti Koşulları', href: '/garanti' },
      { label: 'Toptan Alışveriş', href: '/toptan-satis' },
    ],
  },
];

/**
 * The footer's category block: the whole tree, parents followed by their
 * subcategories, with real hrefs. It used to be thirty labels copied in shape
 * from the reference ("Tv Led Bar", "Fotokapan"…), slugified into links that
 * mostly led nowhere. Twenty-six entries still fill the measured 6-column grid.
 */
export const POPULAR_CATEGORIES = ALL_CATEGORIES.map((node) => ({
  label: node.label,
  href: categoryHref(node.slug),
}));

/**
 * Accepted payment methods, drawn as neutral text chips.
 * The reference shows a row of card-scheme logos here; those are third-party
 * trademarks, so the row's *shape* is reproduced with generic labels instead
 * (brief §10).
 */
/* What checkout actually accepts (src/data/checkout.ts). Card, debit and
   instalment badges come back when an online card provider goes live — a
   badge for a method the checkout refuses is a broken promise. */
export const PAYMENT_METHODS = ['Havale / EFT', 'Kapıda Ödeme', 'Kurumsal Fatura'];
