/**
 * Product detail page — `/urun/[slug]`, the route the catalogue has linked to
 * all along (docs/INFORMATION_ARCHITECTURE §2).
 *
 * What the governing docs bind here, and how each is honoured:
 *
 *   - NO ratings or reviews anywhere: not in the data, the card, this page or
 *     the JSON-LD (docs/PRODUCT_MODEL §mock-data). The catalogue's `ratingMock`
 *     fields exist and are deliberately never read.
 *   - Discount percentage is DERIVED from the two prices, never authored, and
 *     the three price fragments reach a screen reader as ONE phrase
 *     (docs/COMMERCE_RULES §5).
 *   - Product media has a fixed ratio, a neutral bed and `object-fit: contain`
 *     — "the product page contains, the listing fills". It is the LCP element,
 *     so it loads eagerly with `fetchPriority`. Every picture the admin
 *     uploaded is shown: ProductGallery gives them a stage, a thumbnail strip
 *     and a full-screen viewer.
 *   - Specifications render as real `<table>`s, one per group, so the
 *     row/column relationship survives for screen readers (ECDOS 10 §47) —
 *     see ProductSpecs.
 *   - The trust statements come from `PRODUCT_TRUST`, marked in the data as
 *     configurable placeholders that assert nothing.
 *
 * Layout (2026-10-31, from the client's mock): compact, on white, drawn with
 * hairlines rather than shadows. Gallery and buy column side by side; one
 * offer box holding price, purchase and the assurances; tabs; then the
 * description and the sheet side by side on a light band; then the shelves.
 * Red marks only what leads: the price, the add-to-cart button, the active tab
 * and the band's accent line. Every value on it comes from the product.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Aperture,
  BadgeCheck,
  BadgePercent,
  Check,
  ChevronRight,
  Film,
  HardDrive,
  Headphones,
  Home,
  Image as ImageIcon,
  Layers,
  Moon,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  ScanEye,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Truck,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { ProductBuy, ProductLinks } from '@/components/product-buy';
import { ProductGallery } from '@/components/product-gallery';
import { ProductSectionNav } from '@/components/product-section-nav';
import { ProductSpecs } from '@/components/product-specs';
import { SectionHeading } from '@/components/section-heading';
import { ProductGrid } from '@/components/sections';
import {
  brandSlug,
  categoryMeta,
  discountPercent,
  formatPrice,
  PRICE_ON_REQUEST,
  FREE_SHIPPING_FROM,
  type Product,
} from '@/data/catalog';
import { INSTALMENTS_AVAILABLE, PAYMENT_OPTIONS } from '@/data/checkout';
import { PRODUCT_TRUST, SITE } from '@/data/site';
import { keySpecsOf, type SpecGroup } from '@/data/specs';
import { loadCatalog, loadProductDetails, loadProducts } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

const TRUST_ICONS = {
  invoice: ReceiptText,
  badge: BadgeCheck,
  truck: Truck,
  refresh: RefreshCcw,
  support: Headphones,
};

/**
 * A spec or a description line's mark, read from its words so any product gets
 * one; a line nothing matches takes the plain tick. First match wins: "2,8 mm
 * sabit · 3 MP" is a lens before it is a resolution.
 */
const FEATURE_ICONS: [RegExp, LucideIcon][] = [
  [/ir cut|gürültü/i, SlidersHorizontal],
  [/gece|ir led/i, Moon],
  [/lens/i, Aperture],
  [/kanal/i, Layers],
  [/\bmp\b|megapiksel|çözünürlük|1080p/i, ImageIcon],
  [/hareket|algılama|maskeleme/i, ScanEye],
  [/wi-?fi|kablosuz|bağlantı|\bpoe\b/i, Wifi],
  [/solar|güneş/i, Sun],
  [/voltaj|güç|besleme|v dc/i, Zap],
  [/disk|depolama|hdd|sd kart/i, HardDrive],
  [/sıkıştırma|kodlama|h\.26/i, Film],
  [/koruma/i, ShieldCheck],
];
const iconFor = (text: string): LucideIcon =>
  FEATURE_ICONS.find(([pattern]) => pattern.test(text))?.[1] ?? Check;

/**
 * Every product known at build time is prerendered. One added in the Medusa
 * admin afterwards still resolves: dynamicParams stays on, so its first visit
 * renders it and the result is cached like the rest.
 */
export async function generateStaticParams() {
  return (await loadProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { bySlug } = await loadCatalog();
  const product = bySlug(slug);
  if (!product) return { title: 'Ürün bulunamadı' };
  const { description } = await loadProductDetails(product.id);
  const picture = absoluteUrl(product.image);

  return {
    title: product.name,
    description:
      summaryOf(description) ||
      `${product.brand} ${product.name} — ${categoryMeta(product.category).label} kategorisinde ${SITE.name} güvencesiyle.`,
    ...(picture ? { openGraph: { images: [picture] } } : {}),
  };
}

/* ------------------------------------------------------------------ */
/* text helpers                                                        */
/* ------------------------------------------------------------------ */

const BULLET = /^[•\-–]\s*/;

/** Paragraphs and bullet lines of an admin description, kept apart. */
function partsOf(description: string) {
  const blocks = description
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.every((line) => BULLET.test(line))) bullets.push(...lines.map((line) => line.replace(BULLET, '')));
    else paragraphs.push(block);
  }
  return { paragraphs, bullets };
}

/** The description's first paragraph, cut for a meta description (~160). */
function summaryOf(description: string, max = 160): string {
  const first = partsOf(description).paragraphs[0]?.replace(/\s+/g, ' ').trim() ?? '';
  if (first.length <= max) return first;
  return `${first.slice(0, max - 3).replace(/\s+\S*$/, '')}…`;
}

/** The buy column's lead: whole sentences that fit, not a line cut mid-figure. */
function leadOf(description: string, max = 240): string {
  const first = partsOf(description).paragraphs[0]?.replace(/\s+/g, ' ').trim() ?? '';
  let lead = '';
  for (const sentence of first.split(/(?<=[.!?])\s+/)) {
    if ((lead + ' ' + sentence).length > max) break;
    lead = lead ? `${lead} ${sentence}` : sentence;
  }
  return lead || summaryOf(description, max);
}

/** Uploaded pictures carry an absolute URL; the mock files do not. */
const absoluteUrl = (src: string): string | null => (/^https?:\/\//.test(src) ? src : null);

/* ------------------------------------------------------------------ */
/* pieces                                                              */
/* ------------------------------------------------------------------ */

/** One trail, read by both the visible breadcrumb and the BreadcrumbList. */
function trailFor(product: Product) {
  const category = categoryMeta(product.category);
  const parent = category.parent ? categoryMeta(category.parent) : undefined;
  return [
    { label: 'Ana sayfa', href: '/' },
    ...(parent ? [{ label: parent.label, href: parent.href }] : []),
    { label: category.label, href: category.href },
    { label: product.brand, href: `/marka/${brandSlug(product.brand)}` },
  ];
}

/** The visible trail: small and in the background — home as an icon, the
 *  category path, the name (its code on a phone). The brand step stays in the
 *  structured data, and in the line over the title. */
function Breadcrumb({ product }: { product: Product }) {
  const trail = trailFor(product).filter((step) => !step.href.startsWith('/marka/'));

  return (
    <nav aria-label="Konum" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-text-secondary">
        {trail.map((step) => (
          <li key={step.href} className="flex items-center gap-1.5">
            <Link href={step.href} aria-label={step.href === '/' ? step.label : undefined} className="transition-colors hover:text-text-primary">
              {step.href === '/' ? <Home size={14} strokeWidth={1.5} aria-hidden /> : step.label}
            </Link>
            <ChevronRight size={13} strokeWidth={1.5} className="text-line-strong" aria-hidden />
          </li>
        ))}
        <li aria-current="page" className="min-w-0 truncate">
          <span className="sm:hidden">{product.sku || product.name}</span>
          <span className="hidden sm:inline">{product.name}</span>
        </li>
      </ol>
    </nav>
  );
}

/**
 * The heading is the model and what it is, without the brand the line above
 * already names: "SEENERGY SE-IPC5083LD 5MP IP Dome Kamera" becomes
 * "SE-IPC5083LD 5MP IP Dome Kamera". A name without a leading code (a token
 * with a digit) stays whole.
 */
function titleOf(product: Product): { code: string; rest: string } {
  const brand = product.brand.toLocaleLowerCase('tr');
  const bare = product.name.toLocaleLowerCase('tr').startsWith(brand + ' ')
    ? product.name.slice(product.brand.length + 1).trim()
    : product.name;
  const match = bare.match(/^([A-Z0-9][A-Z0-9.-]*\d[A-Z0-9.-]*)\s+(.+)$/);
  return match ? { code: match[1], rest: match[2] } : { code: bare, rest: '' };
}

type SheetCell = { label: string; value: string; detail?: string };

/** Which rows a buyer decides on, most decisive first. */
const SHEET_ORDER = [
  /^çözünürlük/i,
  /kanal sayısı/i,
  /^lens/i,
  /gece/i,
  /solar panel/i,
  /optik|yakınlaştırma/i,
  /bağlantı/i,
  /video sıkıştırma|kodlama/i,
  /disk/i,
  /giriş voltajı|besleme/i,
  /güç tüketimi/i,
  /koruma sınıfı/i,
];

/**
 * The six-cell summary: the product's own sheet, picked by SHEET_ORDER, each
 * value cut to its first clause ("2,8 mm sabit · 5 MP" becomes "2,8 mm
 * sabit"). Without an own sheet, only what the product's name states — never
 * the category template, which is a guess about another product. Three or
 * six cells, so the grid has no hole.
 */
function sheetOf(product: Product, own: SpecGroup[]): SheetCell[] {
  const rows = own.length
    ? own.flatMap((group) => group.rows).filter((row) => !/ürün tipi/i.test(row.label))
    : keySpecsOf({ ...product, price: null }, 6, []);
  const picked: typeof rows = [];
  for (const pattern of SHEET_ORDER) {
    const row = rows.find((candidate) => pattern.test(candidate.label) && !picked.includes(candidate));
    if (row) picked.push(row);
  }
  const cells = picked.map((row) => {
    const clauses = row.value.split(' · ');
    let value = clauses[0].replace(/^En çok /, '');
    /* A long first clause keeps its figure and unit: "8 W monokristal
       silikon" wrapped to three lines in a cell meant for "8 W". */
    const figure = value.length > 14 ? value.match(/^[\d.,]+(?:\s?[–-]\s?[\d.,]+)?\s?[A-Za-z°%]+/) : null;
    if (figure) value = figure[0];
    return {
      label: row.label.charAt(0).toLocaleLowerCase('tr') + row.label.slice(1),
      value,
      /* A resolution's second clause says which system ("AHD 1080p"); a lens's
         ("3 MP") is the glass's rating and would read as the camera's. */
      detail: /^çözünürlük/i.test(row.label) ? clauses[1] : undefined,
    };
  });
  return cells.length >= 6 ? cells.slice(0, 6) : cells.length >= 3 ? cells.slice(0, 3) : [];
}

/** The headline specs as tiles on hairlines: mark, figure, what it measures. */
function SpecSheet({ cells }: { cells: SheetCell[] }) {
  return (
    /* Three cells stay one row at every width (two-up left the third alone
       under the others on a phone); six run 2 × 3, then 3 × 2. */
    <dl className={`mt-4 grid gap-2 ${cells.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
      {cells.map((cell) => {
        const Icon = iconFor(cell.label);
        return (
          <div key={cell.label} className="flex min-w-0 flex-col items-center rounded-(--card-radius) border border-line px-2 py-3 text-center">
            <Icon size={24} strokeWidth={1.5} aria-hidden className="text-text-primary" />
            <dt className="sr-only">{cell.label}</dt>
            <dd className="mt-1.5 text-[14px] font-extrabold leading-tight tabular-nums tracking-tight text-text-primary sm:text-[16px] dt:text-[20px]">
              {cell.value}
            </dd>
            <dd aria-hidden className="mt-1 text-[12px] leading-snug text-text-secondary sm:text-[13px]">
              {cell.label}
            </dd>
            {cell.detail && <dd className="mt-0.5 text-[12px] leading-snug text-text-secondary">{cell.detail}</dd>}
          </div>
        );
      })}
    </dl>
  );
}

/**
 * Price block.
 *
 * The visual parts are `aria-hidden` and a single sr-only sentence carries the
 * whole meaning, so a screen reader hears "2.849,90 ₺, önceki fiyat 3.238,52 ₺,
 * %12 indirim" instead of three disconnected numbers. The saving is derived
 * from the two prices, never authored. `pr-12` keeps the words clear of the
 * favourite button in the box's corner.
 */
function PriceBlock({ product }: { product: Product }) {
  const discount = discountPercent(product);

  /* No price yet: the block says so instead of printing a 0. */
  if (product.price == null) {
    return (
      <div className="pr-12">
        <p className="text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[32px]">
          Fiyat için bize ulaşın
        </p>
        <p className="mt-1 text-[14px] text-text-secondary">Güncel fiyat ve stok bilgisini aynı gün iletiyoruz.</p>
        <p className="sr-only">{PRICE_ON_REQUEST}</p>
      </div>
    );
  }

  const saving = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  return (
    <div className="pr-12">
      <p className="sr-only">
        {formatPrice(product.price)}
        {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
        {discount ? `, %${discount} indirim` : ''}
      </p>

      {discount !== null && discount > 0 && product.compareAtPrice ? (
        <div aria-hidden className="mb-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-[13px] font-extrabold tabular-nums text-signal">%{discount} indirim</span>
          <span className="text-[14px] font-medium tabular-nums text-text-secondary line-through decoration-text-secondary/60">
            {formatPrice(product.compareAtPrice)}
          </span>
        </div>
      ) : null}
      <p aria-hidden className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-signal dt:text-[40px]">
        {formatPrice(product.price)}
      </p>
      <p className="mt-1.5 text-[13px] text-text-secondary">
        KDV dahil · {PAYMENT_OPTIONS.map((option) => option.label).join(' · ')}
      </p>
      {saving > 0 ? (
        <p aria-hidden className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-success-ink">
          <BadgePercent size={15} strokeWidth={1.75} />
          {formatPrice(saving)} tasarruf
        </p>
      ) : null}

      {INSTALMENTS_AVAILABLE && product.instalment && (
        <p className="mt-1 text-[13px] font-semibold text-text-primary">Peşin fiyatına 3 taksit</p>
      )}
    </div>
  );
}

/** Availability and delivery on one line, hairlines between — what an
 *  electronics shopper scans for first. Stock only for a product on sale. */
function StatusLine({ product }: { product: Product }) {
  if (product.price == null) return null;
  const item = 'inline-flex items-center gap-2 text-[13px] font-medium text-text-primary sm:border-l sm:border-line sm:pl-4';
  if (product.stock === 0) {
    return (
      <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-danger-ink">
        <span aria-hidden className="h-2 w-2 rounded-full bg-danger" />
        Şu anda stokta yok
      </p>
    );
  }
  const low = product.stock <= 5;
  const free = product.freeShipping || product.price >= FREE_SHIPPING_FROM;
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <li className={`inline-flex items-center gap-2 text-[13px] font-semibold ${low ? 'text-warning' : 'text-success-ink'}`}>
        <span aria-hidden className={`h-2 w-2 rounded-full ${low ? 'bg-warning' : 'bg-success'}`} />
        {low ? `Son ${product.stock} adet` : 'Stokta'}
      </li>
      <li className={item}>
        <Truck size={17} strokeWidth={1.5} aria-hidden />
        Aynı gün kargoya hazırlanır
      </li>
      <li className={item}>
        <PackageCheck size={17} strokeWidth={1.5} aria-hidden />
        {free ? 'Ücretsiz kargo' : `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz kargo`}
      </li>
    </ul>
  );
}

/* ------------------------------------------------------------------ */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { bySlug, otherModelsOf, alternativesTo, products } = await loadCatalog();
  const product = bySlug(slug);
  if (!product) notFound();

  /* "Uyumlu Kayıt Cihazları": what a camera buyer needs next — the recorders
     of the same system in the catalogue (AHD camera → DVR, IP camera → NVR),
     the camera's own brand first. Recorders themselves get no such section. */
  const recorderPattern =
    product.category === 'ahd-sistem' && !/\bdvr\b|kayıt cihaz/i.test(product.name)
      ? { test: /\bDVR\b|AHD Kayıt Cihaz/i, label: 'DVR' }
      : product.category === 'ip-sistem' && !/\bnvr\b|kayıt cihaz/i.test(product.name)
        ? { test: /\bNVR\b/i, label: 'NVR' }
        : null;
  const recorders = recorderPattern
    ? products
        .filter((item) => item.id !== product.id && recorderPattern.test.test(item.name))
        .sort((a, b) => Number(b.brand === product.brand) - Number(a.brand === product.brand))
        .slice(0, 4)
    : [];

  /* A brand row of one or two cards left most of a four-column shelf empty.
     Under four other models it has no row of its own: those models lead the
     "Benzer Ürünler" row instead, the rest of it filled from the category. */
  const siblingsAll = otherModelsOf(product);
  const ownRow = siblingsAll.length >= 4;
  const siblings = ownRow ? siblingsAll : [];
  const alternatives = (
    ownRow
      ? alternativesTo(product)
      : [...siblingsAll, ...alternativesTo(product).filter((item) => !siblingsAll.some((own) => own.id === item.id))]
  ).filter((item) => !recorders.some((recorder) => recorder.id === item.id));
  const [details, { company }] = await Promise.all([loadProductDetails(product.id), loadVitrin()]);
  const title = titleOf(product);
  const sheet = sheetOf(product, details.specs);
  /* The chip under the offer jumps to the recorders on this page, or — when
     the catalogue has none yet — to a search for them. */
  const related = recorderPattern
    ? {
        label: `Uyumlu ${recorderPattern.label} kayıt cihazları`,
        href: recorders.length ? '#uyumlu-kayit-cihazlari' : `/arama?q=${recorderPattern.label}`,
      }
    : null;
  const category = categoryMeta(product.category);
  const { paragraphs, bullets } = partsOf(details.description);
  const lead = leadOf(details.description);
  /* The small feature boxes: the description's own bullet lines, or, for a
     description without any, the summary's figures. */
  const features = bullets.length ? bullets : sheet.map((cell) => `${cell.value} · ${cell.label}`);

  /* The CUTOUT, not the plated render, for the mock catalogue's own files. The
     flat files carry an opaque white plate that shows up as a white rectangle
     on the stage's tinted bed; the cutouts are transparent. The two
     directories mirror each other exactly (72 files, same names), so the path
     derives rather than needing a second field. Uploaded photos pass through. */
  const gallery = product.images.map((src) =>
    src.startsWith('/mock/products/') ? src.replace('/mock/products/', '/mock/products/cutout/') : src,
  );

  /* The section bar lists only what this product actually has. */
  const sections = [
    ...(details.description ? [{ id: 'aciklama', label: 'Ürün Açıklaması' }] : []),
    { id: 'teknik-ozellikler', label: 'Teknik Özellikler' },
    ...(recorders.length > 0 ? [{ id: 'uyumlu-kayit-cihazlari', label: 'Uyumlu Kayıt Cihazları' }] : []),
    ...(siblings.length > 0 ? [{ id: 'diger-modeller', label: `Diğer ${product.brand} Modelleri` }] : []),
    ...(alternatives.length > 1 ? [{ id: 'benzer-urunler', label: 'Benzer Ürünler' }] : []),
  ];

  return (
    /* White over the page's dot ground. Bottom padding clears the mobile sticky
       buy bar. */
    <div className="bg-surface-card pb-24 dt:pb-10">
      {/* Structured data.
          Product + BreadcrumbList, and deliberately NO aggregateRating or
          review: docs/PRODUCT_MODEL rules a review surface out of the data, the
          card, this page and the JSON-LD alike. `image` only for uploaded
          pictures, which carry an absolute URL. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  ...trailFor(product).map((step, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: step.label,
                    item: step.href,
                  })),
                  {
                    '@type': 'ListItem',
                    position: trailFor(product).length + 1,
                    name: product.name,
                  },
                ],
              },
              {
                '@type': 'Product',
                name: product.name,
                sku: product.sku,
                category: category.label,
                brand: { '@type': 'Brand', name: product.brand },
                ...(details.description && { description: summaryOf(details.description) }),
                ...(absoluteUrl(product.image) && { image: product.images.map(absoluteUrl).filter(Boolean) }),
                /* No offer without a price: structured data must not state
                   one the page does not. */
                ...(product.price != null && {
                  offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'TRY',
                    availability:
                      product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                  },
                }),
              },
            ],
          }),
        }}
      />

      {/* --- gallery + buy column --------------------------------------- */}
      <section aria-label="Ürün bilgileri">
        <div className="container-main pb-5 pt-3 dt:pb-6 dt:pt-3.5">
          <Breadcrumb product={product} />

          <div className="mt-3 grid gap-5 lg:grid-cols-2 dt:gap-8">
            {/* `max-w-[520px]` only while the page is a single column, so the
                picture does not take a whole tablet screen before the price.
                Keyed by product: client navigation between two products reuses
                this position, and the gallery's index must not carry over. */}
            <div className="mx-auto w-full max-w-[520px] lg:sticky lg:top-(--sticky-offset) lg:max-w-none lg:self-start">
              <ProductGallery
                key={product.id}
                images={gallery}
                alt={product.name}
                badges={
                  product.stock > 0 && product.badge === 'super-firsat' ? (
                    <span className="w-fit rounded-full bg-signal px-2.5 py-1 text-[12px] font-medium text-white">
                      Süper Fırsat
                    </span>
                  ) : undefined
                }
              />
            </div>

            <div className="min-w-0">
              {/* Brand, category; the code only when the title does not carry it. */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <div className="flex items-center gap-3 text-[13px]">
                  <Link
                    href={`/marka/${brandSlug(product.brand)}`}
                    title={`${product.brand} ürünleri`}
                    className="font-extrabold text-signal transition-colors hover:text-signal-dark"
                  >
                    {product.brand}
                  </Link>
                  <span aria-hidden className="h-3.5 w-px bg-line-strong" />
                  <Link href={category.href} className="text-text-secondary transition-colors hover:text-text-primary">
                    {category.label}
                  </Link>
                </div>
                {product.sku && title.code !== product.sku ? (
                  <p className="text-[12px] text-text-secondary">
                    Ürün kodu: <span className="font-semibold tabular-nums text-text-primary">{product.sku}</span>
                  </p>
                ) : null}
              </div>

              <h1 className="mt-1.5 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[32px]">
                {title.code}
                {title.rest ? ` ${title.rest}` : ''}
              </h1>
              {lead && <p className="mt-2 text-[14px] leading-relaxed text-text-secondary dt:text-[16px]">{lead}</p>}
              <StatusLine product={product} />

              {sheet.length > 0 && <SpecSheet cells={sheet} />}

              {/* The offer: one box — price, the purchase, then the assurances
                  on a hairline row, two by two on a phone. `relative` places the
                  favourite button ProductBuy puts in its corner. */}
              <div className="relative mt-3 overflow-hidden rounded-(--card-radius) border border-line-strong bg-surface-card">
                <div className="p-4 dt:p-5">
                  <PriceBlock product={product} />
                  <ProductBuy product={product} whatsapp={company.whatsapp || company.phone} />
                </div>
                <ul aria-label="Alışveriş güvenceleri" className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
                  {PRODUCT_TRUST.filter((item) => item.icon !== 'truck').map((item) => {
                    const Icon = TRUST_ICONS[item.icon];
                    return (
                      <li
                        key={item.label}
                        className="flex items-center gap-2 bg-surface-card px-3 py-2.5 text-[12px] font-medium leading-snug text-text-primary"
                      >
                        <Icon size={18} strokeWidth={1.5} aria-hidden className="shrink-0" />
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <ProductLinks product={product} datasheet={details.datasheet} related={related} />
            </div>
          </div>
        </div>
      </section>

      <ProductSectionNav sections={sections} datasheet={details.datasheet} />

      {/* --- description and sheet, side by side on a light band --------- */}
      <div className="border-b border-line bg-surface-page">
        <div className={`container-main grid items-start gap-4 py-5 dt:py-6 ${details.description ? 'lg:grid-cols-2' : ''}`}>
          {details.description && (
            <section
              id="aciklama"
              aria-labelledby="aciklama-baslik"
              className="min-w-0 rounded-(--card-radius) border border-line bg-surface-card p-4 dt:p-5"
            >
              <h2 id="aciklama-baslik" className="text-[20px] font-extrabold tracking-tight text-text-primary">
                Ürün Açıklaması
              </h2>
              <div className="mt-3 space-y-3 border-l-2 border-signal pl-4 text-[14px] leading-relaxed text-text-primary">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
              {features.length > 0 && (
                <ul aria-label="Öne çıkan özellikler" className="mt-4 grid gap-2 sm:grid-cols-2">
                  {features.map((line) => {
                    const Icon = iconFor(line);
                    const [head, ...tail] = line.split(' · ');
                    return (
                      <li key={line} className="flex items-start gap-2.5 rounded-(--card-radius) border border-line px-3 py-2.5">
                        <Icon size={22} strokeWidth={1.5} aria-hidden className="mt-px shrink-0 text-signal" />
                        <span className="min-w-0 text-[13px] leading-snug">
                          <span className="block font-bold text-text-primary">{head}</span>
                          {tail.length > 0 && <span className="block text-text-secondary">{tail.join(' · ')}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          <ProductSpecs product={product} specs={details.specs} />
        </div>
      </div>

      {/* --- recorders of the same system -------------------------------- */}
      {recorders.length > 0 && recorderPattern && (
        <section id="uyumlu-kayit-cihazlari" className="container-main pt-6 dt:pt-8" aria-label="Uyumlu kayıt cihazları">
          <SectionHeading
            eyebrow={`${category.label} · ${recorderPattern.label}`}
            title="Uyumlu Kayıt Cihazları"
            action={{ label: 'Tümü', href: `/arama?q=${recorderPattern.label}` }}
          />
          <div className="pt-3">
            <ProductGrid products={recorders} columns={4} />
          </div>
        </section>
      )}

      {/* --- the brand's other models ------------------------------------ */}
      {siblings.length > 0 && (
        <section id="diger-modeller" className="container-main pt-6 dt:pt-8">
          <SectionHeading
            eyebrow="Aynı marka"
            title={`${product.brand} Diğer Modeller`}
            action={{ label: `Tümü (${siblings.length + 1})`, href: `/marka/${brandSlug(product.brand)}` }}
          />
          <div className="pt-3">
            <ProductGrid products={siblings.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}

      {/* --- same category, other brands -------------------------------
          Two, not one: a single card in a 4-column grid reads as a shelf
          that failed to load. The category stays one click away from the
          spec section's support card. */}
      {alternatives.length > 1 && (
        <section id="benzer-urunler" className="container-main pt-6 dt:pt-8" aria-label="Benzer ürünler">
          <SectionHeading eyebrow={category.label} title="Benzer Ürünler" action={{ label: 'Tümü', href: category.href }} />
          <div className="pt-3">
            <ProductGrid products={alternatives.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
