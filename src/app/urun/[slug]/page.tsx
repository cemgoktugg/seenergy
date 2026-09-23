/* eslint-disable @next/next/no-img-element */
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
 *     so it loads eagerly with `fetchPriority`.
 *   - Specifications render as a real `<table>` so the row/column relationship
 *     survives for screen readers (ECDOS 10 §47); mobile restyles the same
 *     markup rather than replacing it.
 *   - The five trust statements come from `PRODUCT_TRUST`, marked in the data
 *     as configurable placeholders that assert nothing.
 *
 * The rail that matters most is "Aynı markadan diğer modeller": arriving on a
 * product should immediately show the rest of that brand's line-up, which is
 * what `otherModelsOf` resolves.
 */

import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  ChevronRight,
  Headphones,
  ReceiptText,
  RefreshCcw,
  Truck,
} from 'lucide-react';

import { ProductBuy } from '@/components/product-buy';
import { ProductRow } from '@/components/product-row';
import { ProductGrid } from '@/components/sections';
import {
  PRODUCTS,
  brandSlug,
  bySlug,
  alternativesTo,
  categoryMeta,
  discountPercent,
  formatPrice,
  otherModelsOf,
  type Product,
} from '@/data/catalog';
import { PRODUCT_TRUST, SITE } from '@/data/site';
import { categorySpec, keySpecsOf, type CompatibilityItem } from '@/data/specs';

const TRUST_ICONS = {
  invoice: ReceiptText,
  badge: BadgeCheck,
  truck: Truck,
  refresh: RefreshCcw,
  support: Headphones,
};

/** Every product is a known path, so none of them is resolved at request time. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) return { title: 'Ürün bulunamadı' };

  return {
    title: product.name,
    description: `${product.brand} ${product.name} — ${categoryMeta(product.category).label} kategorisinde ${SITE.name} güvencesiyle.`,
  };
}

/* ------------------------------------------------------------------ */
/* pieces                                                              */
/* ------------------------------------------------------------------ */

/** One trail, read by both the visible breadcrumb and the BreadcrumbList. */
function trailFor(product: Product) {
  const category = categoryMeta(product.category);
  return [
    { label: 'Ana sayfa', href: '/' },
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

  return (
    <div className="mt-4">
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

      {product.instalment && (
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
      <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-danger-ink">
        <span aria-hidden className="h-2 w-2 rounded-full bg-danger" />
        Şu anda stokta yok
      </p>
    );
  }

  const low = product.stock <= 5;
  return (
    <p
      className={`mt-3 inline-flex items-center gap-2 text-[13px] font-semibold ${
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

/**
 * Headline specs — the 3-6 values that answer "will this work for me" before
 * the buy button, not after it (docs/PRODUCT_MODEL §2.3). Every one is read out
 * of the product's own name, so nothing here is authored per product.
 */
function KeySpecs({ product }: { product: Product }) {
  const specs = keySpecsOf(product);
  if (specs.length === 0) return null;

  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-(--card-radius) border border-line bg-surface-page px-3 py-3">
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

/**
 * Compatibility gets its own block rather than a row buried in the spec table
 * (docs/COMMERCE_RULES §9): "will this fit what I already have" is the question
 * that blocks the purchase.
 */
function Compatibility({ items }: { items: CompatibilityItem[] }) {
  return (
    <section
      aria-label="Uyumluluk"
      className="rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-4 py-4 dt:px-5"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
        Uyumluluk
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
        Bu ürünün birlikte çalıştığı sistemler ve bağlantı tipleri.
      </p>

      <dl className="mt-4 space-y-3.5">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-[13px] font-semibold text-text-primary">{item.label}</dt>
            {/* Keyed by position as well as value: the list is static and
                unordered, and keying on the value alone made the component
                fragile to a data collision — two entries that normalise to the
                same string produced duplicate React keys. The data is fixed
                separately; this stops the same class of defect being a render
                bug rather than just a content one. */}
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {item.values.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-full border border-line-strong bg-surface-page px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                >
                  {value}
                </span>
              ))}
            </dd>
            {item.note && (
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-text-secondary">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Specification table.
 *
 * Every row is a statement drawn from the catalogue's own fields — nothing here
 * is invented for the page. Grouped general → commercial, as a real table.
 */
function SpecTable({ product }: { product: Product }) {
  const category = categoryMeta(product.category);
  const sheet = categorySpec(product.category);

  /* Catalogue facts first, then the category's own groups, then the commercial
     rows. The category's "Genel" group is merged into ours rather than added as
     a second "Genel" heading. */
  const [first, ...rest] = sheet?.groups ?? [];

  const groups: { title: string; rows: { label: string; value: string; note?: string }[] }[] = [
    {
      title: 'Genel',
      rows: [
        { label: 'Marka', value: product.brand },
        { label: 'Ürün kodu', value: product.sku },
        { label: 'Kategori', value: category.label },
        ...(first?.title === 'Genel' ? first.rows : []),
      ],
    },
    ...(first && first.title !== 'Genel' ? [first] : []),
    ...rest,
    {
      title: 'Ticari',
      rows: [
        { label: 'Fiyat', value: formatPrice(product.price) },
        {
          label: 'Ödeme',
          value: product.instalment ? 'Peşin fiyatına 3 taksit' : 'Tek çekim',
        },
        {
          label: 'Kargo',
          value: product.freeShipping ? 'Ücretsiz kargo' : 'Standart kargo bedeli',
        },
        {
          label: 'Stok',
          value: product.stock === 0 ? 'Tükendi' : `${product.stock} adet`,
        },
      ],
    },
  ];

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{product.name} teknik bilgileri</caption>
      <tbody>
        {/* The key belongs on the outermost element the map returns, which is
            the fragment — not on the first row inside it. */}
        {groups.map((group) => (
          <Fragment key={group.title}>
            <tr>
              <th
                colSpan={2}
                scope="colgroup"
                className="border-b border-line pb-2 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary"
              >
                {group.title}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={`${group.title}-${row.label}`} className="border-b border-line">
                <th
                  scope="row"
                  className="w-[46%] py-2.5 align-top text-[13px] font-medium text-text-secondary"
                >
                  {row.label}
                </th>
                <td className="py-2.5 align-top font-mono text-[13px] tabular-nums text-text-primary">
                  {row.value}
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-brand dt:h-6" />
        <h2 className="truncate text-[16px] font-extrabold tracking-tight text-text-primary dt:text-[20px]">
          {title}
        </h2>
      </div>
      {note && <p className="text-[12px] text-text-secondary dt:text-[13px]">{note}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();

  const siblings = otherModelsOf(product);
  const alternatives = alternativesTo(product);
  const category = categoryMeta(product.category);
  const compatibility = categorySpec(product.category)?.compatibility ?? [];

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
                offers: {
                  '@type': 'Offer',
                  price: product.price,
                  priceCurrency: 'TRY',
                  availability:
                    product.stock > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                },
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
        {/* Three columns from `dt` up: media, buy block, and the brand's other
            models beside them. Below `dt` the grid collapses and the rail falls
            underneath, which is the same DOM in a different flow — the rail is
            never rendered twice. */}
        <div className="grid gap-(--space-grid-gap) lg:grid-cols-2 dt:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_320px]">
          {/* Media. Fixed ratio, neutral bed, contained — and the LCP element,
              so it is not lazy. */}
          {/* `flex flex-col` so the frame below can take the height this panel
              is given. A very slight bed gradient rather than flat white: the
              product renders are drawn on a white plate, so on a white panel
              the device had nothing to sit against. */}
          {/* `max-w-[460px]` only while the page is a single column. A square
              frame across the full width measured 686x686 at 768 — a product
              render taking most of a tablet screen before the price is
              reached. From `lg` the grid splits and the cell governs again. */}
          <div className="relative mx-auto flex w-full max-w-[460px] flex-col overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-b from-surface-card to-surface-page shadow-e1 lg:max-w-none">
            <span
              aria-hidden
              className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
            />
            {/* Measured: the panel stretches to the row height (601px at 1440)
                while this frame stayed locked to the 4:3 reservation (320px),
                so the product image — the most important picture on a product
                page — was drawn at 238x238 and filled 22% of its own panel,
                with ~280px of empty white beneath it.
                From `dt` the frame takes the panel's height instead, which
                roughly doubles the render to ~347px and lands near 51% fill.
                Below `dt` the frame is SQUARE, not the 4:3 `--ratio-product`.
                Two reasons. The renders are square, so a 4:3 box letterboxed
                them and drew the product at 232px inside a 374px column. And
                making the panel a flex container had already broken the 4:3
                by accident — a flex item's `min-height: auto` let the content
                override the aspect ratio, which silently replaced a documented
                reservation with whatever the image happened to be. `min-h-0`
                stops that, and `aspect-square` states the reservation the page
                actually wants instead of inheriting one by accident.
                `--ratio-product` still governs listing cards, where a 4:3 media
                block is what was measured. */}
            <div className="flex aspect-square min-h-0 items-center justify-center p-6 dt:aspect-auto dt:flex-1 dt:p-8">
              {/* The CUTOUT, not the plated render. The flat files carry an
                  opaque white plate; invisible on a white panel, but the moment
                  this bed gained its gradient the plate showed up as a white
                  rectangle floating in the tint. The cutout is transparent, so
                  the product sits on the bed instead of on a card.
                  The two directories mirror each other exactly — 72 files, 72
                  cutouts, same filenames, verified — so the path derives
                  rather than needing a second field in the catalogue. Their
                  viewBoxes are also cropped to the drawing (see
                  scripts/mock/normalize-cutouts.mjs), which is why the device
                  now fills the frame rather than floating inside its canvas. */}
              <img
                src={product.image.replace('/products/', '/products/cutout/')}
                alt={product.name}
                width={600}
                height={600}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute left-4 top-6 flex flex-col gap-1.5">
              {product.badge === 'super-firsat' && product.stock > 0 && (
                <span className="w-fit rounded-full bg-info px-2.5 py-1 text-[11px] font-medium text-white">
                  Süper Fırsat
                </span>
              )}
              {product.freeShipping && product.stock > 0 && (
                <span className="w-fit rounded-full bg-success px-2.5 py-1 text-[11px] font-medium text-white">
                  Ücretsiz Kargo
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/marka/${brandSlug(product.brand)}`}
                className="text-[13px] font-bold text-brand-text transition-colors hover:text-brand-dark"
              >
                {product.brand}
              </Link>
              <span aria-hidden className="h-3 w-px bg-line-strong" />
              <span className="inline-flex items-center rounded-md border border-line bg-surface-page px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.06em] text-text-secondary">
                {product.sku}
              </span>
            </div>

            <h1 className="mt-2 text-[20px] font-extrabold leading-[1.22] tracking-tight text-text-primary dt:text-[28px]">
              {product.name}
            </h1>

            <PriceBlock product={product} />
            <StockLine product={product} />
            <KeySpecs product={product} />
            <ProductBuy product={product} />

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
              className="lg:col-span-2 dt:col-span-1 dt:sticky dt:top-4 dt:self-start"
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

      {/* --- specifications -------------------------------------------- */}
      <section className="container-main pt-6 dt:pt-8" aria-label="Teknik bilgiler">
        <SectionHead title="Teknik Bilgiler" note="Ürün ve kategori bilgileri" />
        <div className="grid gap-(--space-grid-gap) pt-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-4 py-4 dt:px-5">
            <SpecTable product={product} />
          </div>

          <div className="flex flex-col gap-(--space-grid-gap)">
          {compatibility.length > 0 && <Compatibility items={compatibility} />}

          <aside className="rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-4 py-4 dt:px-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
              Kategori
            </p>
            <Link
              href={category.href}
              className="mt-1.5 inline-flex items-center gap-1.5 text-[16px] font-extrabold tracking-tight text-text-primary transition-colors hover:text-brand-text"
            >
              {category.label}
              <ChevronRight size={15} strokeWidth={2.25} aria-hidden />
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
              Bu ürünün uyumluluğu, montajı veya alternatifleri hakkında emin
              değilseniz teknik ekibimiz ürün kodu üzerinden yönlendirme yapar.
            </p>
            <Link
              href="/iletisim"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              Teknik destek
              <ChevronRight size={13} strokeWidth={2.25} aria-hidden />
            </Link>
          </aside>
          </div>
        </div>
      </section>

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
          <SectionHead title="Aynı Kategoride" note={category.label} />
          <div className="pt-3">
            <ProductGrid products={alternatives.slice(0, 4)} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
