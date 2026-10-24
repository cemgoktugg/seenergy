/* eslint-disable @next/next/no-img-element */
/**
 * Brand showcase band — one featured brand, its own products.
 *
 * Seven of these stack on the homepage, so the design has one hard job beyond
 * looking good: survive repetition. What varies between bands is the logo and
 * the data; everything structural stays identical, which is what turns seven
 * panels into a rhythm instead of seven competing headers.
 *
 * That decision was re-examined when a design audit raised "module monotony"
 * against these bands, and it stands: the problem measured was the LENGTH of
 * the unbroken run (y=1793→5576, 3783px at one 541px pitch), not the sameness
 * of the individual bands. The homepage therefore splits the run with the
 * full-bleed technical band after the fourth showcase, and the bands themselves
 * stay uniform. Vary the structure here and the rhythm this comment describes
 * is what you lose.
 *
 * SEENERGY treatment:
 *   - a 3px cap carrying the logo gradient (teal → indigo → purple), the same
 *     device the paired sliders use, so the whole page reads as one system
 *   - near-black brand name, because the wordmark's ink is part of the identity
 *   - monospace spec chips built from REAL catalogue fields (model count, units
 *     in stock, SKU prefix). Technical data is what makes a storefront read as
 *     a technology supplier; invented badges would just be decoration
 *   - tabular figures on the counts so seven bands align down the page
 *
 * A server component: no state, no hooks. The cards bring their own
 * interactivity.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProductGrid } from '@/components/sections';
import type { Product } from '@/data/catalog';

function SpecChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-(--card-radius) border border-line bg-surface-page px-2 py-[3px] font-mono text-[12px] uppercase tracking-[0.08em] tabular-nums text-text-secondary">
      {children}
    </span>
  );
}

export function BrandSection({
  brand,
  tagline,
  href,
  logo,
  banner,
  products,
}: {
  brand: string;
  tagline: string;
  href: string;
  logo: string;
  /**
   * The brand's own artwork, set per band in the admin. When present it IS
   * the header: the artwork already carries the name and the line of
   * business, so repeating them beside it would say everything twice. Shown
   * at its natural ratio — never cropped, because brand art puts text at its
   * edges.
   */
  banner?: string;
  products: Product[];
}) {
  // Derived from the catalogue, not authored: if the data changes, so does this.
  const unitsInStock = products.reduce((total, product) => total + product.stock, 0);
  const skuPrefix = products[0]?.sku.split('-')[0] ?? '';

  return (
    <section
      aria-label={`${brand} ürünleri`}
      className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
    >
      {/* The identity cap — the one saturated element in the band. */}
      <span
        aria-hidden
        className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
      />

      {/* --- header ------------------------------------------------------
          With a banner, the artwork is the header and the whole of it links
          to the brand's page; the heading stays for screen readers and the
          document outline. */}
      {banner ? (
        <>
          <h2 className="sr-only">{brand}</h2>
          <Link href={href} className="group block overflow-hidden border-b border-line bg-surface-page">
            <img
              src={banner}
              alt={`${brand} — tüm ürünler`}
              className="block h-auto w-full transition-transform duration-(--duration-slow) ease-out motion-safe:group-hover:scale-[1.015]"
              loading="lazy"
            />
          </Link>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-3 py-3 dt:px-5 dt:py-4">
          {logo && (
            <>
              <span className="grid h-11 w-[104px] shrink-0 place-items-center rounded-(--card-radius) border border-line bg-surface-card px-2 dt:h-12 dt:w-[124px]">
                <img
                  src={logo}
                  alt={`${brand} logosu`}
                  className="max-h-8 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span className="hidden h-8 w-px shrink-0 bg-line-strong sm:block" aria-hidden />
            </>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-extrabold tracking-tight text-text-primary dt:text-[20px]">
              {brand}
            </h2>
            <p className="truncate text-[12px] text-text-secondary dt:text-[13px]">{tagline}</p>
          </div>

          {/* Spec chips: catalogue facts, in the typeface technical data belongs
              in. Hidden below `sm` where the header has no room for them. */}
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <SpecChip>{products.length} model</SpecChip>
            <SpecChip>{unitsInStock} adet stok</SpecChip>
            {skuPrefix && <SpecChip>SKU {skuPrefix}</SpecChip>}
          </div>

          <Link
            href={href}
            className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold text-text-primary transition-colors duration-(--duration-fast) ease-in-out hover:border-brand hover:bg-brand hover:text-white sm:ml-auto sm:w-auto sm:justify-start dt:text-[13px]"
          >
            Tüm Ürünler
            <ArrowRight size={14} strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
      )}

      {/* --- products ---------------------------------------------------- */}
      <div className="p-3 dt:p-4">
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
