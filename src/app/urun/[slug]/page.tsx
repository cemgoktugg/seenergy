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
 * Layout (2026-10-21 redesign, the client found the page "sönük"): one white
 * hero band holding the gallery and a sales-first buy column — title, a lead
 * line, headline specs as icon tiles, then ONE purchase card (price, stock,
 * quantity, "Sepete Ekle"); quote and compare are secondary, below the cart
 * button. A sticky section bar follows the hero. The brand's other models
 * moved from a narrow third column into a four-up grid under the specs:
 * the third column squeezed the gallery and buy box into two thin columns,
 * which is most of why the page read as flat.
 */

/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  BadgePercent,
  Check,
  ChevronRight,
  Download,
  Headphones,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  Truck,
  Wallet,
} from 'lucide-react';

import { ProductBuy, ProductLinks } from '@/components/product-buy';
import { ProductGallery } from '@/components/product-gallery';
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
import { BRANDS, PRODUCT_TRUST, SITE } from '@/data/site';
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

function Breadcrumb({ product }: { product: Product }) {
  const trail = trailFor(product);

  return (
    <nav aria-label="Konum" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-text-secondary">
        {trail.map((step) => (
          <li key={step.href} className="flex items-center gap-1.5">
            <Link href={step.href} className="transition-colors hover:text-text-primary">
              {step.label}
            </Link>
            <ChevronRight size={13} strokeWidth={2} className="text-line-strong" aria-hidden />
          </li>
        ))}
        <li aria-current="page" className="truncate font-medium text-text-primary">
          {product.sku || product.name}
        </li>
      </ol>
    </nav>
  );
}

/**
 * Price block.
 *
 * The visual parts are `aria-hidden` and a single sr-only sentence carries the
 * whole meaning, so a screen reader hears "2.849,90 ₺, önceki fiyat 3.238,52 ₺,
 * %12 indirim" instead of three disconnected numbers.
 */
/**
 * The heading as a datasheet heads a model: its code, then what it is.
 * "SEENERGY SE-IPC5083LD 5MP IP Dome Kamera" becomes SE-IPC5083LD over
 * "5MP IP Dome Kamera". A name without a leading code (a token with a digit)
 * stays whole.
 */
function titleOf(product: Product): { code: string; rest: string } {
  const brand = product.brand.toLocaleLowerCase('tr');
  const bare = product.name.toLocaleLowerCase('tr').startsWith(brand + ' ')
    ? product.name.slice(product.brand.length + 1).trim()
    : product.name;
  const match = bare.match(/^([A-Z0-9][A-Z0-9.-]*\d[A-Z0-9.-]*)\s+(.+)$/);
  return match ? { code: match[1], rest: match[2] } : { code: bare, rest: '' };
}

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
function sheetOf(product: Product, own: SpecGroup[]): { label: string; value: string }[] {
  const rows = own.length
    ? own.flatMap((group) => group.rows).filter((row) => !/ürün tipi/i.test(row.label))
    : keySpecsOf({ ...product, price: null }, 6, []);
  const picked: typeof rows = [];
  for (const pattern of SHEET_ORDER) {
    const row = rows.find((candidate) => pattern.test(candidate.label) && !picked.includes(candidate));
    if (row) picked.push(row);
  }
  const cells = picked.map((row) => {
    let value = row.value.split(' · ')[0].replace(/^En çok /, '');
    /* A long first clause keeps its figure and unit: "8 W monokristal
       silikon" wrapped to three lines in a cell meant for "8 W". */
    const figure = value.length > 14 ? value.match(/^[\d.,]+(?:\s?[–-]\s?[\d.,]+)?\s?[A-Za-z°%]+/) : null;
    if (figure) value = figure[0];
    return { label: row.label.charAt(0).toLocaleLowerCase('tr') + row.label.slice(1), value };
  });
  return cells.length >= 6 ? cells.slice(0, 6) : cells.length >= 3 ? cells.slice(0, 3) : [];
}

/** The headline specs as tiles: the figure large, what it measures under it. */
function SpecSheet({ cells }: { cells: { label: string; value: string }[] }) {
  return (
    <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {cells.map((cell) => (
        <div key={cell.label} className="rounded-(--card-radius) border border-line bg-surface-page px-3.5 py-3">
          <dt className="sr-only">{cell.label}</dt>
          <dd className="text-[16px] font-extrabold leading-tight tabular-nums tracking-tight text-text-primary dt:text-[20px]">
            {cell.value}
          </dd>
          <dd aria-hidden className="mt-1 text-[12px] font-medium text-text-secondary">
            {cell.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Price block.
 *
 * The visual parts are `aria-hidden` and a single sr-only sentence carries the
 * whole meaning, so a screen reader hears "2.849,90 ₺, önceki fiyat 3.238,52 ₺,
 * %12 indirim" instead of three disconnected numbers. The saving is derived
 * from the two prices, never authored.
 */
function PriceBlock({ product }: { product: Product }) {
  const discount = discountPercent(product);

  /* No price yet: the block says so instead of printing a 0. */
  if (product.price == null) {
    return (
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-text-secondary">Fiyat</p>
        <p className="mt-1 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[32px]">
          Fiyat için bize ulaşın
        </p>
        <p className="mt-1 text-[14px] text-text-secondary">Güncel fiyat ve stok bilgisini aynı gün iletiyoruz.</p>
        <p className="sr-only">{PRICE_ON_REQUEST}</p>
      </div>
    );
  }

  const saving = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  return (
    <div>
      <p className="sr-only">
        {formatPrice(product.price)}
        {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
        {discount ? `, %${discount} indirim` : ''}
      </p>

      {discount !== null && discount > 0 && product.compareAtPrice ? (
        <div aria-hidden className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="rounded-(--card-radius) bg-danger px-2 py-1 text-[13px] font-extrabold tabular-nums leading-none text-white">
            %{discount} İNDİRİM
          </span>
          <span className="text-[16px] font-medium tabular-nums text-text-secondary line-through decoration-text-secondary/60">
            {formatPrice(product.compareAtPrice)}
          </span>
        </div>
      ) : null}
      <p aria-hidden className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-[40px] font-extrabold leading-none tracking-tight tabular-nums text-text-primary">
          {formatPrice(product.price)}
        </span>
        <span className="text-[13px] font-medium text-text-secondary">KDV dahil</span>
      </p>
      {saving > 0 ? (
        <p aria-hidden className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-success-ink">
          <BadgePercent size={15} strokeWidth={2.25} />
          {formatPrice(saving)} tasarruf
        </p>
      ) : null}

      {INSTALMENTS_AVAILABLE && product.instalment && (
        <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-(--card-radius) border border-highlight/40 bg-surface-instalment px-2.5 py-1.5 text-[12px] font-medium text-white">
          PEŞİN FİYATINA <span className="font-extrabold text-highlight">3 TAKSİT</span>
        </p>
      )}
    </div>
  );
}

/** Availability and delivery as pills under the heading — what an
 *  electronics shopper scans for first. Stock only for a product on sale. */
function StatusPills({ product }: { product: Product }) {
  const pill = 'inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-bold';
  if (product.price == null) return null;
  if (product.stock === 0) {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`${pill} bg-danger/10 text-danger-ink`}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-danger" />
          Şu anda stokta yok
        </span>
      </div>
    );
  }
  const low = product.stock <= 5;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className={`${pill} ${low ? 'bg-warning/15 text-warning' : 'bg-success/10 text-success-ink'}`}>
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${low ? 'bg-warning' : 'bg-success'}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${low ? 'bg-warning' : 'bg-success'}`} />
        </span>
        {low ? `Son ${product.stock} adet` : 'Stokta'}
      </span>
      <span className={`${pill} bg-surface-page text-text-primary`}>
        <PackageCheck size={14} strokeWidth={2.25} aria-hidden />
        Aynı gün kargoya hazırlanır
      </span>
      {product.freeShipping || (product.price ?? 0) >= FREE_SHIPPING_FROM ? (
        <span className={`${pill} bg-surface-page text-text-primary`}>
          <Truck size={14} strokeWidth={2.25} aria-hidden />
          Ücretsiz kargo
        </span>
      ) : null}
    </div>
  );
}

/** The buy card's foot: delivery, preparation, payment — three facts in a row. */
function OfferFacts({ product }: { product: Product }) {
  const free = product.freeShipping || (product.price ?? 0) >= FREE_SHIPPING_FROM;
  const facts = [
    { icon: Truck, title: 'Kargo', text: free ? 'Bu ürün ücretsiz kargo' : `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz` },
    { icon: PackageCheck, title: 'Hazırlık', text: 'Aynı gün kargoya hazırlanır' },
    { icon: Wallet, title: 'Ödeme', text: PAYMENT_OPTIONS.map((option) => option.label).join(' · ') },
  ];
  return (
    <ul className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
      {facts.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-2.5 bg-surface-page px-4 py-3">
          <Icon size={18} strokeWidth={2} aria-hidden className="mt-0.5 shrink-0 text-text-primary" />
          <span className="min-w-0">
            <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-text-secondary">{title}</span>
            <span className="block text-[13px] font-semibold leading-snug text-text-primary">{text}</span>
          </span>
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

  /* A brand row of one or two cards left most of a four-column shelf empty.
     Under four other models it has no row of its own: those models lead the
     "Benzer Ürünler" row instead, the rest of it filled from the category. */
  const siblingsAll = otherModelsOf(product);
  const ownRow = siblingsAll.length >= 4;
  const siblings = ownRow ? siblingsAll : [];
  const alternatives = ownRow
    ? alternativesTo(product)
    : [...siblingsAll, ...alternativesTo(product).filter((item) => !siblingsAll.some((own) => own.id === item.id))];
  const [details, { company }] = await Promise.all([loadProductDetails(product.id), loadVitrin()]);
  const title = titleOf(product);
  const sheet = sheetOf(product, details.specs);
  /* What a camera buyer needs next: a recorder of the same system. */
  const related =
    product.category === 'ip-sistem' && !/nvr/i.test(product.name)
      ? { label: 'Uyumlu NVR kayıt cihazları', href: '/arama?q=NVR' }
      : product.category === 'ahd-sistem' && !/dvr/i.test(product.name)
        ? { label: 'Uyumlu DVR kayıt cihazları', href: '/arama?q=DVR' }
        : null;
  const category = categoryMeta(product.category);
  const brandLogo = BRANDS.find((brand) => brand.slug === brandSlug(product.brand))?.image ?? null;
  const { paragraphs, bullets } = partsOf(details.description);
  const lead = summaryOf(details.description, 190);

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
    ...(siblings.length > 0 ? [{ id: 'diger-modeller', label: `Diğer ${product.brand} Modelleri` }] : []),
    ...(alternatives.length > 1 ? [{ id: 'benzer-urunler', label: 'Benzer Ürünler' }] : []),
  ];

  return (
    /* Bottom padding clears the mobile sticky buy bar. */
    <div className="pb-24 dt:pb-0">
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

      {/* --- hero: gallery + buy column ----------------------------------
          One white band over the grey page, so the product and its purchase
          read as the page's subject and everything below as reference. */}
      <section aria-label="Ürün bilgileri" className="relative overflow-hidden border-b border-line bg-surface-card">
        <div className="container-main relative pb-8 pt-3 dt:pb-14 dt:pt-5">
          <Breadcrumb product={product} />

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] dt:mt-6 dt:gap-12">
            {/* `max-w-[520px]` only while the page is a single column, so the
                picture does not take a whole tablet screen before the price.
                Keyed by product: client navigation between two products reuses
                this position, and the gallery's index must not carry over. */}
            <div className="mx-auto w-full max-w-[520px] lg:sticky lg:top-(--sticky-offset) lg:max-w-none lg:self-start">
              <ProductGallery
                key={product.id}
                images={gallery}
                alt={product.name}
                callouts={details.callouts}
                badges={
                  product.stock > 0 && (product.badge === 'super-firsat' || product.freeShipping) ? (
                    <>
                      {product.badge === 'super-firsat' && (
                        <span className="w-fit rounded-full bg-info px-2.5 py-1 text-[12px] font-medium text-white">
                          Süper Fırsat
                        </span>
                      )}
                      {product.freeShipping && (
                        <span className="w-fit rounded-full bg-success px-2.5 py-1 text-[12px] font-medium text-white">
                          Ücretsiz Kargo
                        </span>
                      )}
                    </>
                  ) : undefined
                }
              />
            </div>

            <div className="min-w-0">
              {/* Brand (its logo where the shop has one), category, code. */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/marka/${brandSlug(product.brand)}`}
                    title={`${product.brand} ürünleri`}
                    className="inline-flex h-8 items-center rounded-full border border-line bg-white px-3 shadow-e1 transition-colors hover:border-line-strong"
                  >
                    {brandLogo ? (
                      <img src={brandLogo} alt={product.brand} className="h-4 w-auto max-w-[96px] object-contain" />
                    ) : (
                      <span className="text-[13px] font-extrabold text-ink-fixed">{product.brand}</span>
                    )}
                  </Link>
                  <Link
                    href={category.href}
                    className="inline-flex h-8 items-center rounded-full bg-surface-page px-3 text-[13px] font-semibold text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {category.label}
                  </Link>
                </div>
                {product.sku ? (
                  <p className="text-[12px] font-medium text-text-secondary">
                    Ürün kodu: <span className="font-bold tabular-nums text-text-primary">{product.sku}</span>
                  </p>
                ) : null}
              </div>

              {/* The model code leads, the way a datasheet is headed: it is
                  what an installer searches for and quotes. The rest of the
                  name is the second line of the same heading. */}
              <h1 className="mt-4 text-text-primary">
                <span className="block text-[32px] font-extrabold leading-none tracking-tight tabular-nums dt:text-[40px]">
                  {title.code}
                </span>
                {title.rest && (
                  <span className="mt-2 block text-[20px] font-semibold leading-snug text-text-secondary">{title.rest}</span>
                )}
              </h1>
              <StatusPills product={product} />
              {lead && (
                <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-text-secondary">{lead}</p>
              )}

              {sheet.length > 0 && <SpecSheet cells={sheet} />}

              {/* The offer: one card — price, the purchase, and the three
                  facts that decide it (delivery, preparation, payment). */}
              <div className="mt-5 overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e2">
                <div className="p-5 dt:p-6">
                  <PriceBlock product={product} />
                  <ProductBuy product={product} whatsapp={company.whatsapp || company.phone} />
                </div>
                {product.price != null ? <OfferFacts product={product} /> : null}
              </div>

              <ProductLinks product={product} datasheet={details.datasheet} related={related} />

              <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRODUCT_TRUST.filter((item) => item.icon !== 'truck').map((item) => {
                  const Icon = TRUST_ICONS[item.icon];
                  return (
                    <li
                      key={item.label}
                      className="flex flex-col items-start gap-2 rounded-(--card-radius) border border-line px-3 py-3 text-[13px] font-semibold leading-snug text-text-primary"
                    >
                      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-surface-page text-text-primary">
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- section bar -------------------------------------------------
          Sticks under the condensed header (h-14), so the long reference half
          of the page stays navigable. Plain anchors: no state, no script. */}
      <nav
        aria-label="Ürün bölümleri"
        className="sticky top-14 z-30 border-b border-line bg-surface-card/90 backdrop-blur"
      >
        <div className="container-main">
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="relative flex h-12 items-center px-3 text-[13px] font-semibold text-text-secondary transition-colors duration-(--duration-fast) hover:text-text-primary"
                >
                  {section.label}
                </a>
              </li>
            ))}
            {details.datasheet && (
              <li className="ml-auto shrink-0">
                <a
                  href={details.datasheet}
                  target="_blank"
                  rel="noopener"
                  className="flex h-12 items-center gap-1.5 px-3 text-[13px] font-semibold text-text-primary"
                >
                  <Download size={15} strokeWidth={2.25} aria-hidden />
                  Teknik föy
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* --- description: the write-up beside its highlights ------------ */}
      {details.description && (
        <section id="aciklama" className="container-main pt-8 dt:pt-12" aria-label="Ürün açıklaması">
          <SectionHeading eyebrow="Ürün detayları" title="Ürün Açıklaması" />
          <div className="mt-4 grid items-start gap-(--space-grid-gap) lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="rounded-(--panel-radius) border border-line bg-surface-card px-5 py-5 shadow-e1 dt:px-7 dt:py-6">
              <div className="max-w-[72ch] space-y-4 text-[14px] leading-[1.75] text-text-primary dt:text-[16px]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            {bullets.length > 0 && (
              <aside
                aria-label="Öne çıkan özellikler"
                className="relative overflow-hidden rounded-(--panel-radius) bg-chrome px-5 py-5 text-white shadow-e2 dt:px-6 dt:py-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-grad-1/25 blur-3xl"
                />
                <p className="relative text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Öne çıkan özellikler
                </p>
                <ul className="relative mt-4 space-y-3">
                  {bullets.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[14px] leading-snug">
                      <span
                        aria-hidden
                        className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-chrome"
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </section>
      )}

      <ProductSpecs product={product} specs={details.specs} />

      {/* --- the brand's other models ------------------------------------ */}
      {siblings.length > 0 && (
        <section id="diger-modeller" className="container-main pt-8 dt:pt-12">
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
        <section id="benzer-urunler" className="container-main pt-8 pb-8 dt:pt-12" aria-label="Benzer ürünler">
          <SectionHeading eyebrow={category.label} title="Benzer Ürünler" action={{ label: 'Tümü', href: category.href }} />
          <div className="pt-3">
            <ProductGrid products={alternatives.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
