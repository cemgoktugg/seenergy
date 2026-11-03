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
 *   - Service lines state only what the data or the shop's own pages back, and
 *     link to those pages (see ServiceList).
 *
 * Layout (2026-11-01, the client's second brief): a white stage beside the buy
 * column (55 / 45), then tabs that swap in place (description beside a technical
 * summary, the full grouped sheet, the documents), then the shelves. Hairlines
 * instead of shadows; the add-to-cart button is the one filled red. Everything
 * shown comes from the product, and what it does not have is left out: no promise
 * here that the product's data cannot back.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Aperture,
  Check,
  ChevronRight,
  Download,
  FileText,
  Film,
  HardDrive,
  Headphones,
  Home,
  Image as ImageIcon,
  Layers,
  Moon,
  RefreshCcw,
  ScanEye,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Truck,
  Wallet,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { ProductBuy, ProductLinks } from '@/components/product-buy';
import { ProductGallery } from '@/components/product-gallery';
import { ProductSpecs } from '@/components/product-specs';
import { ProductTabs } from '@/components/product-tabs';
import { SectionHeading } from '@/components/section-heading';
import { ProductGrid } from '@/components/sections';
import {
  brandSlug,
  categoryMeta,
  discountPercent,
  formatPrice,
  FREE_SHIPPING_FROM,
  type Product,
} from '@/data/catalog';
import { INSTALMENTS_AVAILABLE, PAYMENT_OPTIONS } from '@/data/checkout';
import { SITE } from '@/data/site';
import { keySpecsOf, type SpecGroup } from '@/data/specs';
import { loadCatalog, loadProductDetails, loadProducts } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

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
    alternates: { canonical: `/urun/${slug}` },
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

/** The file a document link names: the upload's name without its timestamp. */
function documentOf(url: string): { name: string; type: string } {
  const file = decodeURIComponent(url.split('?')[0].split('/').pop() ?? '').replace(/^\d{10,}-/, '');
  return { name: file, type: file.split('.').pop()?.toUpperCase() ?? '' };
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
 *  category path, the name. The brand step stays in the structured data, and in
 *  the label over the title. */
function Breadcrumb({ product }: { product: Product }) {
  const trail = trailFor(product).filter((step) => !step.href.startsWith('/marka/'));

  return (
    <nav aria-label="Konum" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-text-secondary">
        {trail.map((step) => (
          <li key={step.href} className="flex items-center gap-1.5">
            <Link href={step.href} aria-label={step.href === '/' ? step.label : undefined} className="transition-colors hover:text-text-primary">
              {step.href === '/' ? <Home size={14} strokeWidth={1.5} aria-hidden /> : step.label}
            </Link>
            <ChevronRight size={13} strokeWidth={1.5} className="text-line-strong" aria-hidden />
          </li>
        ))}
        {/* On a phone the heading right below already says it. */}
        <li aria-current="page" className="hidden min-w-0 truncate sm:block">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}

/**
 * The heading as a datasheet heads a model: its code, then what it is, without
 * the brand the label above already names. "SEENERGY SE-IPC5083LD 5MP IP Dome
 * Kamera" becomes SE-IPC5083LD over "5MP IP Dome Kamera". A name without a
 * leading code (a token with a digit) stays whole.
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
 * The summary strip: the product's own sheet, picked by SHEET_ORDER, each value
 * cut to its first clause ("2,8 mm sabit · 5 MP" becomes "2,8 mm sabit").
 * Without an own sheet, only what the product's name states — never the category
 * template, which is a guess about another product. Three or four cells, so the
 * strip has no hole; fewer say nothing and it is left out.
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
  return cells.length >= 3 ? cells.slice(0, 4) : [];
}

/** The headline specs: one strip of hairline cells, two by two on a phone when
 *  there are four. */
function SpecSheet({ cells }: { cells: SheetCell[] }) {
  return (
    <dl
      className={`mt-4 grid gap-px overflow-hidden rounded-(--card-radius) border border-line bg-line ${
        cells.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
      }`}
    >
      {cells.map((cell) => {
        const Icon = iconFor(cell.label);
        return (
          <div key={cell.label} className="min-w-0 bg-surface-card px-3 py-2.5">
            <Icon size={20} strokeWidth={1.5} aria-hidden className="text-text-secondary" />
            <dt className="sr-only">{cell.label}</dt>
            <dd className="mt-1.5 break-words text-[16px] font-bold leading-tight tabular-nums text-text-primary">{cell.value}</dd>
            <dd aria-hidden className="mt-0.5 text-[12px] leading-snug text-text-secondary">
              {cell.label}
            </dd>
            {cell.detail && <dd className="text-[12px] leading-snug text-text-secondary">{cell.detail}</dd>}
          </div>
        );
      })}
    </dl>
  );
}

/** Stock, beside the KDV note. Only for a product on sale. */
function StockNote({ product }: { product: Product }) {
  if (product.stock === 0) {
    return (
      <span className="inline-flex items-center gap-2 font-semibold text-danger-ink">
        <span aria-hidden className="h-2 w-2 rounded-full bg-danger" />
        Stokta yok
      </span>
    );
  }
  const low = product.stock <= 5;
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${low ? 'text-warning' : 'text-success-ink'}`}>
      <span aria-hidden className={`h-2 w-2 rounded-full ${low ? 'bg-warning' : 'bg-success'}`} />
      {low ? `Son ${product.stock} adet` : 'Stokta'}
    </span>
  );
}

/**
 * Price block.
 *
 * The visual parts are `aria-hidden` and a single sr-only sentence carries the
 * whole meaning, so a screen reader hears "2.849,90 ₺, önceki fiyat 3.238,52 ₺,
 * %12 indirim" instead of three disconnected numbers. The discount is derived
 * from the two prices, never authored.
 */
function PriceBlock({ product }: { product: Product }) {
  const discount = discountPercent(product);

  /* No price: not for sale, and the buy block's one "Tükendi" button says so
     (the client, 2026-11-03: no quote or WhatsApp asking for a price). */
  if (product.price == null) return null;

  return (
    <div>
      <p className="sr-only">
        {formatPrice(product.price)}
        {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
        {discount ? `, %${discount} indirim` : ''}
      </p>

      {discount !== null && discount > 0 && product.compareAtPrice ? (
        <p aria-hidden className="mb-1 flex flex-wrap items-center gap-x-2.5 text-[14px]">
          <span className="font-bold tabular-nums text-signal">%{discount} indirim</span>
          <span className="tabular-nums text-text-secondary line-through">{formatPrice(product.compareAtPrice)}</span>
        </p>
      ) : null}
      <p aria-hidden className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-text-primary dt:text-[40px]">
        {formatPrice(product.price)}
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-text-secondary">
        KDV dahil
        <span aria-hidden className="h-3.5 w-px bg-line-strong" />
        <StockNote product={product} />
      </p>
      {INSTALMENTS_AVAILABLE && product.instalment && (
        <p className="mt-1 text-[14px] font-semibold text-text-primary">Peşin fiyatına 3 taksit</p>
      )}
    </div>
  );
}

/**
 * Delivery and support, each a fact the shop's data or pages back and a link to
 * the page that states it in full. The free-shipping line is derived from the
 * price; a product without a price has no shipping or payment to state yet.
 */
function ServiceList({ product }: { product: Product }) {
  const free = product.freeShipping || (product.price ?? 0) >= FREE_SHIPPING_FROM;
  const items = [
    ...(product.price != null
      ? [
          {
            icon: Truck,
            title: 'Kargo',
            text: free ? 'Bu ürün ücretsiz kargo' : `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz`,
            href: '/kargo-teslimat',
          },
          { icon: Wallet, title: 'Ödeme', text: PAYMENT_OPTIONS.map((option) => option.label).join(', '), href: '/sss' },
        ]
      : []),
    { icon: RefreshCcw, title: 'İade ve değişim', text: 'Koşulları inceleyin', href: '/iade-degisim' },
    {
      icon: Headphones,
      title: 'Ürün desteği',
      text: 'Teknik ekibimize yazın',
      href: `/iletisim?konu=teknik&urun=${encodeURIComponent(product.sku)}`,
    },
  ];
  return (
    <ul className="mt-3 grid gap-px overflow-hidden rounded-(--card-radius) border border-line bg-line sm:grid-cols-2">
      {items.map(({ icon: Icon, title, text, href }) => (
        <li key={title} className="bg-surface-card">
          <Link
            href={href}
            className="flex min-h-11 items-center gap-2.5 px-3 py-2 transition-colors duration-(--duration-fast) hover:bg-surface-page"
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-secondary" />
            <span className="min-w-0 text-[13px] leading-snug">
              <span className="block font-semibold text-text-primary">{title}</span>
              <span className="block text-text-secondary">{text}</span>
            </span>
          </Link>
        </li>
      ))}
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
  const { bySlug, otherModelsOf, alternativesTo } = await loadCatalog();
  const product = bySlug(slug);
  if (!product) notFound();

  const [details, { company }] = await Promise.all([loadProductDetails(product.id), loadVitrin()]);
  /* A brand row of one or two cards left most of a four-column shelf empty.
     Under four other models it has no row of its own: those models lead the
     "Benzer Ürünler" row instead, the rest of it filled from the category. */
  const siblingsAll = otherModelsOf(product);
  const ownRow = siblingsAll.length >= 4;
  const siblings = ownRow ? siblingsAll : [];
  const alternatives = ownRow
    ? alternativesTo(product)
    : [...siblingsAll, ...alternativesTo(product).filter((item) => !siblingsAll.some((own) => own.id === item.id))];
  const title = titleOf(product);
  const sheet = details.specsOff ? [] : sheetOf(product, details.specs);
  const category = categoryMeta(product.category);
  const { paragraphs, bullets } = partsOf(details.description);
  /* The technical summary: the description's own bullet lines, or, for a
     description without any, the strip's figures. */
  const features = bullets.length ? bullets : sheet.map((cell) => `${cell.value} · ${cell.label}`);

  /* The CUTOUT, not the plated render, for the mock catalogue's own files. The
     flat files carry an opaque white plate that shows up as a white rectangle
     on the stage's tinted bed; the cutouts are transparent. The two
     directories mirror each other exactly (72 files, same names), so the path
     derives rather than needing a second field. Uploaded photos pass through. */
  const gallery = product.images.map((src) =>
    src.startsWith('/mock/products/') ? src.replace('/mock/products/', '/mock/products/cutout/') : src,
  );

  const documents = details.datasheet ? [{ url: details.datasheet, ...documentOf(details.datasheet) }] : [];

  /* The tabs list only what this product actually has. */
  const tabs = [
    ...(details.description
      ? [
          {
            id: 'aciklama',
            label: 'Ürün Açıklaması',
            content: (
              <div className="grid items-start gap-5 lg:grid-cols-[50fr_50fr] dt:gap-8">
                <div className="min-w-0">
                  <h2 className="sr-only">Ürün Açıklaması</h2>
                  <div className="max-w-[68ch] space-y-3 text-[16px] leading-relaxed text-text-primary">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                {features.length > 0 && (
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold text-text-primary">Teknik özet</h3>
                    <ul className="mt-2 divide-y divide-line border-y border-line">
                      {features.map((line) => {
                        const Icon = iconFor(line);
                        const [head, ...tail] = line.split(' · ');
                        return (
                          <li key={line} className="flex items-start gap-3 py-2.5">
                            <Icon size={20} strokeWidth={1.5} aria-hidden className="mt-px shrink-0 text-signal" />
                            <span className="min-w-0 text-[14px] leading-snug text-text-primary">
                              <span className="font-semibold">{head}</span>
                              {tail.length > 0 && <span className="block text-text-secondary">{tail.join(', ')}</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    ...(details.specsOff
      ? []
      : [
          {
            id: 'teknik-ozellikler',
            label: 'Teknik Özellikler',
            content: <ProductSpecs product={product} specs={details.specs} />,
          },
        ]),
    ...(documents.length > 0
      ? [
          {
            id: 'dokumanlar',
            label: 'Dokümanlar',
            content: (
              <>
                <h2 className="sr-only">Dokümanlar</h2>
                <ul className="grid gap-2 lg:grid-cols-2 lg:gap-x-8">
                  {documents.map((document) => (
                    <li key={document.url}>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener"
                        className="flex min-h-13 items-center gap-3 rounded-(--card-radius) border border-line px-3 py-2 transition-colors duration-(--duration-fast) hover:border-text-primary"
                      >
                        <FileText size={24} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-secondary" />
                        <span className="min-w-0 flex-1 text-[14px] leading-snug">
                          <span className="block break-words font-semibold text-text-primary">{document.name}</span>
                          {document.type && <span className="block text-[12px] text-text-secondary">{document.type} dosyası</span>}
                        </span>
                        <Download size={20} strokeWidth={1.5} aria-hidden className="shrink-0 text-text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
        ]
      : []),
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

      {/* --- the showcase: gallery + buy column ------------------------- */}
      <section aria-label="Ürün bilgileri">
        <div className="container-main pb-5 pt-3 dt:pb-6 dt:pt-3.5">
          <Breadcrumb product={product} />

          <div className="mt-3 grid gap-5 lg:grid-cols-[50fr_50fr] dt:gap-8">
            {/* Keyed by product: client navigation between two products reuses
                this position, and the gallery's index must not carry over. */}
            <div className="min-w-0 lg:sticky lg:top-(--sticky-offset) lg:self-start">
              <ProductGallery
                key={product.id}
                images={gallery}
                alt={product.name}
                badges={
                  product.stock > 0 && product.badge === 'super-firsat' ? (
                    <span className="w-fit rounded-(--card-radius) bg-signal px-2.5 py-1 text-[12px] font-medium text-white">
                      Süper Fırsat
                    </span>
                  ) : undefined
                }
              />
            </div>

            <div className="min-w-0">
              {/* Brand label, category; the code only when the title does not
                  carry it. */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                  <Link
                    href={`/marka/${brandSlug(product.brand)}`}
                    title={`${product.brand} ürünleri`}
                    className="relative inline-flex h-9 items-center rounded-(--card-radius) border border-text-primary px-3 text-[16px] font-extrabold tracking-[0.02em] text-text-primary transition-colors duration-(--duration-fast) before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] hover:bg-text-primary hover:text-surface-card"
                  >
                    {product.brand}
                  </Link>
                  <Link href={category.href} className="relative text-text-secondary transition-colors duration-(--duration-fast) before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] hover:text-text-primary">
                    {category.label}
                  </Link>
                </div>
                {product.sku && title.code !== product.sku ? (
                  <p className="text-[12px] text-text-secondary">
                    Ürün kodu: <span className="font-semibold tabular-nums text-text-primary">{product.sku}</span>
                  </p>
                ) : null}
              </div>

              {/* The model code leads: it is what an installer searches for and
                  quotes. What the product is, is the second line of the heading. */}
              <h1 className="mt-2.5 text-text-primary">
                <span className="block break-words text-[24px] font-extrabold leading-[1.1] tracking-tight sm:text-[32px]">{title.code}</span>
                {title.rest && (
                  <span className="mt-1 block text-[16px] font-medium leading-snug text-text-secondary dt:text-[20px]">{title.rest}</span>
                )}
              </h1>

              {sheet.length > 0 && <SpecSheet cells={sheet} />}

              {product.price != null && (
                <div className="mt-4">
                  <PriceBlock product={product} />
                </div>
              )}
              <ProductBuy product={product} />
              <ProductLinks product={product} whatsapp={company.whatsapp} />
              <ServiceList product={product} />
            </div>
          </div>
        </div>
      </section>

      {tabs.length > 0 && <ProductTabs tabs={tabs} />}

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
