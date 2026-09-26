'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * "Öne Çıkan Markalar" — every featured brand in one band, one tab per brand.
 *
 * This replaces seven stacked brand bands. Each band was well made; together
 * they were 3,787px — 38% of the desktop homepage — spent showing four products
 * at a time from one brand, and the page read as the same panel seven times.
 * The technical band was wedged into the run to break it up; that treated the
 * symptom. One band with brand tabs shows the same 28 products in ~600px, and
 * lets the visitor choose the brand instead of scrolling past the ones they do
 * not want.
 *
 * Every panel is rendered, only the selected one is shown (`hidden`): the
 * links stay in the HTML for search engines and for visitors without
 * JavaScript, and lazy images in hidden panels are not fetched until their tab
 * is opened.
 *
 * Data comes from the Vitrin module (admin → Vitrin → Marka vitrinleri): each
 * entry there is one tab, in that order.
 */

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { formatPrice, type Product } from '@/data/catalog';

export interface ShowcaseBrand {
  handle: string;
  name: string;
  tagline: string;
  logo: string;
  /** The four shown in the panel. */
  products: Product[];
  /** All of the brand's products, for the "N model" line. */
  modelCount: number;
  /** Lowest price across the brand's products. */
  fromPrice: number | null;
}

export function BrandShowcase({ brands }: { brands: ShowcaseBrand[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  if (brands.length === 0) return null;

  /* Arrow keys move along the tab list and select, Home/End jump to the ends
     — the standard tabs pattern, so a keyboard user is not made to Tab through
     every brand to reach the products. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = brands.length - 1;
    const next =
      event.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : event.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
    >
      <span aria-hidden className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4" />

      {/* --- header ------------------------------------------------------- */}
      <div className="px-3 pt-4 dt:px-5 dt:pt-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
          Marka vitrini
        </p>
        <h2 id={`${baseId}-title`} className="mt-1 text-[20px] font-extrabold tracking-tight text-text-primary dt:text-[24px]">
          Öne Çıkan Markalar
        </h2>
      </div>

      {/* --- brand tabs --------------------------------------------------- */}
      {/* Logo plates stay white in both themes: the marks are drawn for white.
          A swipeable row on small screens; from `dt` the tabs share the full
          width equally instead of leaving a gap after the last brand. */}
      <div
        role="tablist"
        aria-label="Markalar"
        onKeyDown={onKeyDown}
        className="rail auto-cols-max gap-2 border-b border-line px-3 pb-3 pt-3 dt:auto-cols-fr dt:gap-2.5 dt:px-5 dt:pb-4"
      >
        {brands.map((brand, i) => {
          const selected = i === active;
          return (
            <button
              key={brand.handle}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative grid h-14 w-[118px] place-items-center rounded-(--card-radius) border bg-white px-3 transition-[border-color,box-shadow] duration-(--duration-fast) dt:h-16 dt:w-auto ${
                selected
                  ? 'border-brand shadow-e2 ring-1 ring-brand'
                  : 'border-line hover:border-line-strong hover:shadow-e1'
              }`}
            >
              <img src={brand.logo} alt="" className="max-h-9 w-auto max-w-full object-contain dt:max-h-12" loading="lazy" />
              <span className="sr-only">{brand.name}</span>
              {selected && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-linear-to-r from-grad-1 to-grad-4"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* --- panels ------------------------------------------------------- */}
      {brands.map((brand, i) => (
        <div
          key={brand.handle}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          className="grid gap-(--space-grid-gap) p-3 dt:grid-cols-[250px_minmax(0,1fr)] dt:p-5"
        >
          {/* The brand's card: what it is, how much of it there is, where it
              starts, and the way into all of it. */}
          <div className="relative flex flex-col overflow-hidden rounded-(--card-radius) border border-line bg-linear-to-br from-brand-soft via-surface-card to-surface-card p-4 dt:p-5">
            <div className="hidden h-16 w-full place-items-center rounded-(--card-radius) bg-white px-4 ring-1 ring-black/5 dt:grid">
              <img src={brand.logo} alt={`${brand.name} logosu`} className="max-h-11 w-auto max-w-full object-contain" loading="lazy" />
            </div>
            <h3 className="text-[18px] font-extrabold tracking-tight text-text-primary dt:mt-4 dt:text-[22px]">
              {brand.name}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-text-secondary">{brand.tagline}</p>
            <p className="mt-3 text-[12.5px] text-text-secondary">
              <span className="font-bold tabular-nums text-text-primary">{brand.modelCount} model</span>
              {/* No case suffix after the price: Turkish picks 'den / 'dan by
                  how the number is READ ("…doksan" → 'dan), which changes with
                  every price. "başlangıç" needs none. */}
              {brand.fromPrice !== null ? (
                <>
                  {' · başlangıç '}
                  <span className="font-bold tabular-nums text-text-primary">{formatPrice(brand.fromPrice)}</span>
                </>
              ) : null}
            </p>
            <Link
              href={`/marka/${brand.handle}`}
              className="group/all mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors duration-(--duration-fast) hover:bg-brand-dark dt:mt-auto"
            >
              Tüm {brand.name} ürünleri
              <ArrowRight size={14} strokeWidth={2.25} aria-hidden className="transition-transform duration-(--duration-base) group-hover/all:translate-x-0.5" />
            </Link>
          </div>

          {/* A swipeable rail on phones (two cards in view), a grid of four
              from `lg`. `rail-rows-lg` switches the flow back to rows there —
              see globals.css for why that cannot be a utility. */}
          <div className="rail rail-rows-lg auto-cols-[calc(50%_-_5px)] gap-(--space-grid-gap) sm:auto-cols-[calc(33.333%_-_7px)] lg:grid-cols-4">
            {brand.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
