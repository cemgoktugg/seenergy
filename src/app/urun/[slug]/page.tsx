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
 *   - The five trust statements come from `PRODUCT_TRUST`, marked in the data
 *     as configurable placeholders that assert nothing.
 *
 * The rail that matters most is "Aynı markadan diğer modeller": arriving on a
 * product should immediately show the rest of that brand's line-up, which is
 * what `otherModelsOf` resolves.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  ReceiptText,
  RefreshCcw,
  Truck,
} from 'lucide-react';

import { ProductBuy } from '@/components/product-buy';
import { ProductGallery } from '@/components/product-gallery';
import { ProductRow } from '@/components/product-row';
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

/** The description's first paragraph, cut for a meta description (~160). */
function summaryOf(description: string): string {
  const first = description.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? '';
  if (first.length <= 160) return first;
  return `${first.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}

/** Uploaded pictures carry an absolute URL; the mock files do not. */
const absoluteUrl = (src: string): string | null => (/^https?:\/\//.test(src) ? src : null);

/**
 * The admin's description: paragraphs, and a block whose every line starts
 * with "•" or "-" becomes a list — the shape a product write-up usually
 * takes (an intro, then the highlights).
 */
function Description({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="max-w-[80ch] space-y-3.5 text-[14px] leading-relaxed text-text-primary dt:text-[15px]">
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const bullets = lines.every((line) => /^[•\-–]\s*/.test(line));
        if (!bullets) {
          return (
            <p key={index} className="whitespace-pre-line">
              {block}
            </p>
          );
        }
        return (
          <ul key={index} className="grid gap-x-6 gap-y-2 pt-1 sm:grid-cols-2">
            {lines.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-chrome text-white"
                >
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>{line.replace(/^[•\-–]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

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
          {product.name}
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
        <p className="text-[20px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[24px]">
          {PRICE_ON_REQUEST}
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          Güncel fiyat ve stok bilgisi için ürün kodunu (<span className="font-mono">{product.sku}</span>) belirterek
          bize ulaşın; proje ve adetli alımlarda kurumsal teklif hazırlanır.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="sr-only">
        {formatPrice(product.price)}
        {product.compareAtPrice
          ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}`
          : ''}
        {discount ? `, %${discount} indirim` : ''}
      </p>

      <div aria-hidden className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {/* 34 → 32: two pixels from the 32 tier is not a tier, it is a stray.
            28 stays — it is a real step between 24 and 32 on the same ~1.17
            ratio the rest of the display sizes follow, and the PDP price has
            to outrank a card price (24px) on mobile. */}
        <span className="text-[28px] font-extrabold leading-none tabular-nums text-text-primary dt:text-[32px]">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-[16px] font-medium tabular-nums text-danger-ink line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discount !== null && discount > 0 && (
          <span className="rounded-full bg-danger/10 px-2.5 py-1 text-[12px] font-bold tabular-nums text-danger-ink">
            %{discount} indirim
          </span>
        )}
      </div>

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
    <p
      className={`inline-flex items-center gap-2 text-[13px] font-semibold ${
        low ? 'text-danger-ink' : 'text-success-ink'
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${low ? 'bg-danger' : 'bg-success'}`}
      />
      {low ? `Son ${product.stock} adet` : `Stokta · ${product.stock} adet`}
    </p>
  );
}

/** What shipping costs this visitor, stated before they reach the cart. */
function ShippingLine({ product }: { product: Product }) {
  if (product.stock === 0) return null;
  return (
    <p className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary">
      <Truck size={15} strokeWidth={2} aria-hidden className="text-text-primary" />
      {product.freeShipping
        ? 'Ücretsiz kargo'
        : `${formatPrice(FREE_SHIPPING_FROM)} üzeri siparişlerde ücretsiz kargo`}
    </p>
  );
}

/**
 * Headline specs — the 3-6 values that answer "will this work for me" before
 * the buy button, not after it (docs/PRODUCT_MODEL §2.3). Every one is read out
 * of the product's own name, so nothing here is authored per product.
 */
function KeySpecs({ product, own }: { product: Product; own: SpecGroup[] }) {
  const specs = keySpecsOf(product, 4, own);
  if (specs.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-(--card-radius) border border-line bg-surface-page px-3 py-3">
      {specs.map((spec) => (
        <div key={spec.label} className="min-w-0">
          <dt className="truncate text-[11px] text-text-secondary">{spec.label}</dt>
          <dd className="truncate font-mono text-[13px] font-semibold tabular-nums text-text-primary">
            {spec.value}
          </dd>
        </div>
      ))}
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

  const siblings = otherModelsOf(product);
  const alternatives = alternativesTo(product);
  const details = await loadProductDetails(product.id);
  const category = categoryMeta(product.category);

  /* The CUTOUT, not the plated render, for the mock catalogue's own files. The
     flat files carry an opaque white plate that shows up as a white rectangle
     on the stage's tinted bed; the cutouts are transparent. The two
     directories mirror each other exactly (72 files, same names), so the path
     derives rather than needing a second field. Uploaded photos pass through. */
  const gallery = product.images.map((src) =>
    src.startsWith('/mock/products/') ? src.replace('/mock/products/', '/mock/products/cutout/') : src,
  );

  return (
    /* Bottom padding clears the mobile sticky buy bar. */
    <div className="pb-24 dt:pb-0">
      {/* Structured data.
          Product + BreadcrumbList, and deliberately NO aggregateRating or
          review: docs/PRODUCT_MODEL rules a review surface out of the data, the
          card, this page and the JSON-LD alike, and emitting a rating here that
          exists nowhere on the page would be the worst version of it.
          `image` is omitted rather than emitted as a relative path — this build
          has no canonical origin configured, and an invalid URL in structured
          data is worse than an absent field. */}
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
                      product.stock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                  },
                }),
              },
            ],
          }),
        }}
      />
      <section className="container-main pt-3 dt:pt-5">
        <Breadcrumb product={product} />
      </section>

      {/* --- buy area --------------------------------------------------- */}
      <section className="container-main pt-3 dt:pt-4" aria-label="Ürün bilgileri">
        {/* Three columns from `dt` up: gallery, buy block, and the brand's
            other models beside them. Below `dt` the grid collapses and the rail
            falls underneath — the same DOM in a different flow, never rendered
            twice.
            Gallery and buy block split EVENLY. They were 4fr : 5fr when the
            media was one fixed picture; a gallery with a thumbnail strip is the
            reason to look at this page and gets the width to be one. */}
        <div className="grid gap-(--space-grid-gap) lg:grid-cols-2 dt:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
          {/* `max-w-[520px]` only while the page is a single column: a square
              stage across the full width measured 686x686 at 768 — a product
              picture taking most of a tablet screen before the price is
              reached. From `lg` the grid splits and the cell governs again.
              Keyed by product: client navigation between two products reuses
              this position, and the gallery's index must not carry over. */}
          <div className="mx-auto w-full max-w-[520px] lg:max-w-none dt:sticky dt:top-(--sticky-offset) dt:self-start">
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

          {/* Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/marka/${brandSlug(product.brand)}`}
                className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-[12px] font-bold text-brand-text transition-colors duration-(--duration-fast) hover:bg-brand hover:text-white"
              >
                {product.brand}
              </Link>
              <span className="inline-flex items-center rounded-md border border-line bg-surface-card px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.06em] text-text-secondary">
                {product.sku}
              </span>
              <Link
                href={category.href}
                className="text-[12px] font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {category.label}
              </Link>
            </div>

            <h1 className="mt-3 text-[22px] font-extrabold leading-[1.2] tracking-tight text-text-primary text-balance dt:text-[30px]">
              {product.name}
            </h1>

            {/* The buy box. Price, availability, the headline specs and the
                buttons are one decision, so they sit on one card: the column
                itself is on the page ground, and a price floating on grey
                read as a caption rather than the thing to act on.
                The specs stay BEFORE the button (docs/PRODUCT_MODEL §2.3):
                they answer "will this work for me", which comes first. */}
            <div className="mt-4 rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1 dt:mt-5 dt:p-6">
              <PriceBlock product={product} />
              {/* Stock and shipping belong to a product that can be bought now. */}
              {product.price != null && (
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line pt-3">
                  <StockLine product={product} />
                  <ShippingLine product={product} />
                </div>
              )}
              {keySpecsOf(product, 4, details.specs).length > 0 && (
                <div className="mt-4">
                  <KeySpecs product={product} own={details.specs} />
                </div>
              )}
              <ProductBuy product={product} />
            </div>

            {/* The manufacturer's datasheet. Installers and project buyers
                ask for it before anything else, and it is the one document
                that settles a spec question without a phone call. */}
            {details.datasheet && (
              <a
                href={details.datasheet}
                target="_blank"
                rel="noopener"
                className="group mt-3 flex items-center gap-3 rounded-(--panel-radius) border border-line bg-surface-card px-4 py-3 shadow-e1 transition-colors duration-(--duration-fast) hover:border-text-primary"
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

            <p className="mt-3 text-[12px] text-text-secondary">
              Proje ve toptan alımlar için{' '}
              <Link
                href="/kurumsal"
                className="font-semibold text-brand-text underline decoration-brand/40 underline-offset-2 transition-colors hover:text-brand-dark"
              >
                kurumsal teklif isteyin
              </Link>
              .
            </p>

            {/* Five statements, none of which asserts a certification.
                A PANEL, not loose text under a hairline. This column sits
                directly on the page ground — measured rgb(246,246,246) — so
                five lines of rgb(102,106,108) under a 1px rule were the
                quietest thing in the buy column, at the one point where the
                visitor has just read the price and is deciding. The contrast
                was never the failure (4.7:1 there, AA clear); the failure was
                presence: everything else on this page is a panel and this was
                the exception.
                The lift is the surface and the icon tiles, not the type — the
                labels move from secondary to primary at medium weight and stop
                there, because five loud lines under the CTA would compete with
                the price instead of reassuring about it.
                The 2-column flow leaves the fifth item alone on row three. That
                is left alone: with the content left-aligned in its cell, a
                spanning last row would look identical and fix nothing. */}
            <ul className="mt-5 grid grid-cols-1 gap-x-5 gap-y-3 rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 p-4 sm:grid-cols-2 dt:p-5">
              {PRODUCT_TRUST.map((item) => {
                const Icon = TRUST_ICONS[item.icon];
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-text-primary"
                  >
                    <span
                      aria-hidden
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-(--card-radius) bg-brand/8 text-brand-text"
                    >
                      <Icon size={15} strokeWidth={2} />
                    </span>
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* --- the brand's other models --------------------------------
              Beside the product, not 900px under it: on a product page the next
              question is almost always "what else does this brand make", and an
              answer below three other sections is an answer nobody reaches.
              Sticky on desktop so it stays with the buy block while the specs
              scroll past. */}
          {siblings.length > 0 && (
            <aside
              aria-label={`${product.brand} diğer modeller`}
              className="lg:col-span-2 dt:col-span-1 dt:sticky dt:top-(--sticky-offset) dt:self-start"
            >
              <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
                <span
                  aria-hidden
                  className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
                />
                <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                      Aynı marka
                    </p>
                    <p className="truncate text-[16px] font-extrabold tracking-tight text-text-primary">
                      {product.brand}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md border border-line bg-surface-page px-2 py-[3px] font-mono text-[11px] tabular-nums text-text-secondary">
                    {siblings.length} model
                  </span>
                </div>

                <ul className="divide-y divide-line px-1.5 py-1.5">
                  {siblings.map((item) => (
                    <li key={item.id}>
                      <ProductRow product={item} />
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line p-2.5">
                  <Link
                    href={`/marka/${brandSlug(product.brand)}`}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-line-strong text-[13px] font-semibold text-text-primary transition-colors duration-(--duration-fast) hover:border-brand hover:bg-brand hover:text-white"
                  >
                    Tüm {product.brand} ürünleri
                    <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* --- description ------------------------------------------------
          The admin's own text, when there is any. Line breaks are kept, since
          that is how people write a product description into a textarea. */}
      {details.description && (
        <section className="container-main pt-6 dt:pt-8" aria-label="Ürün açıklaması">
          <SectionHeading eyebrow="Ürün detayları" title="Ürün Açıklaması" />
          <div className="mt-3 rounded-(--panel-radius) border border-line bg-surface-card px-4 py-4 shadow-e1 dt:px-6 dt:py-5">
            <Description text={details.description} />
          </div>
        </section>
      )}

      <ProductSpecs product={product} specs={details.specs} />

      {/* --- same category, other brands -------------------------------
          Two, not one. `alternativesTo` returns same-category/other-brand
          products, and some categories hold exactly one — this Tekniva
          all-in-one has a single alternative. Rendered into a 4-column grid
          that is one 315px card in a 1320px container: 24% filled, a heading
          over ~1000px of nothing, which reads as a shelf that failed to load
          rather than a category with one other brand in it.
          The information is not lost. The sidebar already carries a
          "KATEGORİ — <name> ›" card linking to the full category, so the single
          alternative stays one click away by a route that does not look
          broken. */}
      {alternatives.length > 1 && (
        <section className="container-main pt-6 pb-8 dt:pt-8" aria-label="Benzer ürünler">
          <SectionHeading eyebrow={category.label} title="Aynı Kategoride" action={{ label: 'Tümü', href: category.href }} />
          <div className="pt-3">
            <ProductGrid products={alternatives.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
