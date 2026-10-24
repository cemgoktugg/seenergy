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

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Aperture,
  BadgeCheck,
  BatteryCharging,
  Camera,
  Check,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  HardDrive,
  Headphones,
  Layers,
  Moon,
  ReceiptText,
  RefreshCcw,
  Sun,
  Tag,
  Truck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

import { ProductBuy } from '@/components/product-buy';
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
import { INSTALMENTS_AVAILABLE } from '@/data/checkout';
import { PRODUCT_TRUST, SITE } from '@/data/site';
import { keySpecsOf, type SpecGroup } from '@/data/specs';
import { loadCatalog, loadProductDetails, loadProducts } from '@/lib/medusa/catalog';

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
function PriceBlock({ product }: { product: Product }) {
  const discount = discountPercent(product);

  /* No price yet: the block says how to get one instead of printing a 0. */
  if (product.price == null) {
    return (
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">Fiyat</p>
        <p className="mt-1 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[28px]">
          {PRICE_ON_REQUEST}
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          Bu model için güncel fiyat ve stok bilgisi teklifle verilir. Ürün kodu{' '}
          <span className="font-mono font-semibold text-text-primary">{product.sku}</span>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="sr-only">
        {formatPrice(product.price)}
        {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
        {discount ? `, %${discount} indirim` : ''}
      </p>

      <div aria-hidden className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {discount !== null && discount > 0 && (
          <span className="rounded-full bg-danger px-2.5 py-1 text-[12px] font-extrabold tabular-nums text-white">
            %{discount}
          </span>
        )}
        {product.compareAtPrice && (
          <span className="text-[16px] font-medium tabular-nums text-text-secondary line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>
      <p aria-hidden className="mt-1 flex items-baseline gap-2">
        <span className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-text-primary dt:text-[38px]">
          {formatPrice(product.price)}
        </span>
        <span className="text-[12px] font-medium text-text-secondary">KDV dahil</span>
      </p>

      {INSTALMENTS_AVAILABLE && product.instalment && (
        <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-(--card-radius) border border-highlight/40 bg-surface-instalment px-2.5 py-1.5 text-[11px] font-medium text-white">
          PEŞİN FİYATINA <span className="font-extrabold text-highlight">3 TAKSİT</span>
        </p>
      )}
    </div>
  );
}

function StockLine({ product }: { product: Product }) {
  if (product.stock === 0) {
    return (
      <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-danger-ink">
        <span aria-hidden className="h-2 w-2 rounded-full bg-danger" />
        Şu anda stokta yok
      </p>
    );
  }

  const low = product.stock <= 5;
  return (
    <p className={`inline-flex items-center gap-2 text-[13px] font-semibold ${low ? 'text-danger-ink' : 'text-success-ink'}`}>
      <span aria-hidden className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${low ? 'bg-danger' : 'bg-success'}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${low ? 'bg-danger' : 'bg-success'}`} />
      </span>
      {low ? `Son ${product.stock} adet` : 'Stokta · hemen kargoda'}
    </p>
  );
}

/** What shipping costs this visitor, stated before they reach the cart. */
function ShippingLine({ product }: { product: Product }) {
  if (product.stock === 0) return null;
  return (
    <p className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary">
      <Truck size={15} strokeWidth={2} aria-hidden className="text-text-primary" />
      {product.freeShipping ? 'Ücretsiz kargo' : `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz kargo`}
    </p>
  );
}

/** A mark for a headline spec, read off its label. */
function iconFor(label: string): LucideIcon {
  const key = label.toLocaleLowerCase('tr');
  if (/çözünürlük|görüntü/.test(key)) return Camera;
  if (/lens/.test(key)) return Aperture;
  if (/gece/.test(key)) return Moon;
  if (/solar|panel/.test(key)) return Sun;
  if (/batarya|pil|kapasite|enerji/.test(key)) return BatteryCharging;
  if (/bağlantı|ağ|wi-?fi/.test(key)) return Wifi;
  if (/disk|depolama|bellek/.test(key)) return HardDrive;
  if (/kanal|port/.test(key)) return Layers;
  if (/tip/.test(key)) return Tag;
  return Cpu;
}

/**
 * Headline specs — the values that answer "will this work for me" before the
 * buy button, not after it (docs/PRODUCT_MODEL §2.3): the product's own sheet
 * when it has one, otherwise read out of its name.
 */
function KeySpecs({ product, own }: { product: Product; own: SpecGroup[] }) {
  const specs = keySpecsOf(product, 4, own);
  if (specs.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-2.5">
      {specs.map((spec) => {
        const Icon = iconFor(spec.label);
        return (
          <div
            key={spec.label}
            className="flex min-w-0 items-center gap-3 rounded-(--card-radius) border border-line bg-surface-page px-3 py-2.5"
          >
            {/* The icon steps aside below `sm`: two columns at 390 left the
                value ~90px and cut "8 kanal IP ka…" short. Values wrap to two
                lines rather than truncating. */}
            <span
              aria-hidden
              className="hidden h-9 w-9 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1 sm:grid"
            >
              <Icon size={17} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <dt className="truncate text-[12px] font-medium text-text-secondary">{spec.label}</dt>
              <dd className="line-clamp-2 text-[14px] font-bold leading-snug tabular-nums text-text-primary">{spec.value}</dd>
            </div>
          </div>
        );
      })}
    </dl>
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
  const details = await loadProductDetails(product.id);
  const category = categoryMeta(product.category);
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
        <span
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-grad-1/15 blur-3xl"
        />
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
                badges={
                  product.stock > 0 && (product.badge === 'super-firsat' || product.freeShipping) ? (
                    <>
                      {product.badge === 'super-firsat' && (
                        <span className="w-fit rounded-full bg-info px-2.5 py-1 text-[11px] font-medium text-white">
                          Süper Fırsat
                        </span>
                      )}
                      {product.freeShipping && (
                        <span className="w-fit rounded-full bg-success px-2.5 py-1 text-[11px] font-medium text-white">
                          Ücretsiz Kargo
                        </span>
                      )}
                    </>
                  ) : undefined
                }
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/marka/${brandSlug(product.brand)}`}
                  className="inline-flex items-center rounded-full bg-chrome px-3 py-1 text-[11.5px] font-extrabold tracking-[0.08em] text-white transition-opacity duration-(--duration-fast) hover:opacity-85"
                >
                  {product.brand}
                </Link>
                <Link
                  href={category.href}
                  className="inline-flex items-center rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-text-secondary transition-colors duration-(--duration-fast) hover:border-text-primary hover:text-text-primary"
                >
                  {category.label}
                </Link>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] text-text-secondary">
                  Ürün kodu
                  <span className="font-mono font-semibold text-text-primary">{product.sku}</span>
                </span>
              </div>

              <h1 className="mt-4 text-[26px] font-extrabold leading-[1.12] tracking-tight text-text-primary text-balance dt:text-[36px]">
                {product.name}
              </h1>
              {lead && (
                <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-text-secondary dt:text-[15px]">{lead}</p>
              )}

              {keySpecsOf(product, 4, details.specs).length > 0 && (
                <div className="mt-5">
                  <KeySpecs product={product} own={details.specs} />
                </div>
              )}

              {/* The purchase card: price, availability, quantity and the cart
                  button are one decision, so they sit on one surface. Quote and
                  compare are secondary and sit under the cart button. */}
              <div className="mt-5 rounded-(--panel-radius) border border-line bg-surface-card p-5 shadow-e2 dt:p-6">
                <PriceBlock product={product} />
                {product.price != null && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <StockLine product={product} />
                    <ShippingLine product={product} />
                  </div>
                )}
                <ProductBuy product={product} />
              </div>

              {/* The manufacturer's datasheet. Installers and project buyers
                  ask for it before anything else. */}
              {details.datasheet && (
                <a
                  href={details.datasheet}
                  target="_blank"
                  rel="noopener"
                  className="group mt-3 flex items-center gap-3 rounded-(--panel-radius) border border-line bg-surface-card px-4 py-3 transition-colors duration-(--duration-fast) hover:border-text-primary"
                >
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-(--card-radius) bg-[rgb(195,19,28)]/10 text-[rgb(195,19,28)]"
                  >
                    <FileText size={19} strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-text-primary">Teknik föy (PDF)</span>
                    <span className="block truncate text-[12px] text-text-secondary">
                      {product.sku} · üretici teknik özellik belgesi
                    </span>
                  </span>
                  <Download
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden
                    className="shrink-0 text-text-secondary transition-transform duration-(--duration-fast) group-hover:translate-y-0.5 group-hover:text-text-primary"
                  />
                </a>
              )}

              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 sm:grid-cols-3">
                {PRODUCT_TRUST.map((item) => {
                  const Icon = TRUST_ICONS[item.icon];
                  return (
                    <li key={item.label} className="flex items-center gap-2 text-[12.5px] font-medium text-text-primary">
                      <Icon size={16} strokeWidth={2} aria-hidden className="shrink-0 text-text-secondary" />
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
              <div className="max-w-[72ch] space-y-4 text-[14.5px] leading-[1.75] text-text-primary dt:text-[15px]">
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
                <p className="relative text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Öne çıkan özellikler
                </p>
                <ul className="relative mt-4 space-y-3">
                  {bullets.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[13.5px] leading-snug">
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
