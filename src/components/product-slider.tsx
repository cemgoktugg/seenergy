'use client';

/**
 * Compact product slider — two of these sit side by side directly under the
 * hero, in the band the reference gives to its 4-tile campaign strip. The
 * client asked for product rails there instead, so this component is ours
 * rather than a measured reproduction: it is built from this project's tokens
 * and the existing ProductCard, not from reference geometry.
 *
 * A quiet inset surface, compact cards and a shared navigation capsule keep
 * the pair about 15% shorter than the original 486.5px desktop panels. Image
 * stages and spacing absorb the reduction; product names and prices retain
 * their normal type sizes. Other ProductCard usages keep their usual density.
 *
 * Mechanics: native scroll + scroll-snap (the existing `.rail` utility), not a
 * transformed track. It keeps touch drag, trackpad swipe and keyboard arrow
 * scrolling working for free, and stays inside the dependency budget — no
 * carousel library.
 *
 * Deliberately NOT autoplaying. The hero above it already advances on a 5s
 * timer; two more self-advancing tracks in the same viewport would fight it for
 * attention and, just as importantly, would make every screenshot in the visual
 * workbench land on a different frame. Paging is user-driven.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import type { Product } from '@/data/catalog';

/**
 * One look for both panels (2026-10-23: the client found a red and a blue
 * panel disjointed, and asked for something that says "electronics and
 * security technology"). The CCTV monitor is the motif: viewfinder corner
 * marks, a faint engineering grid, a slow scan line behind the cards, and a
 * status LED with a monospaced product count beside the heading. All in the
 * site's steel palette; the white cards carry the colour.
 */
const CORNER = 'pointer-events-none absolute h-3.5 w-3.5 border-text-primary/30';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProductSlider({
  title,
  eyebrow,
  href,
  products,
}: {
  title: string;
  eyebrow: string;
  href: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);


  /* One page is one track width, so the page count follows from the scroll
     extent. Measured on mount, on resize and on every scroll — the cards are
     sized in percentages, so the count changes with the breakpoint. */
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    setPages(Math.max(1, Math.round(el.scrollWidth / width)));
    setPage(Math.round(el.scrollLeft / width));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener('scroll', measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', measure);
    };
  }, [measure]);

  const goTo = useCallback(
    (next: number) => {
      const el = trackRef.current;
      if (!el) return;
      const target = Math.min(Math.max(next, 0), pages - 1);
      el.scrollTo({
        left: target * el.clientWidth,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [pages],
  );

  const controlBase =
    'grid h-11 w-11 place-items-center rounded-full text-text-primary transition-colors duration-(--duration-fast) enabled:hover:bg-brand enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-25 dt:h-8 dt:w-8';

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-line-strong/70 bg-surface-card"
    >
      {/* Behind everything: the grid and the scan line. */}
      <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10" />
      <span aria-hidden className="tech-scan pointer-events-none absolute inset-x-0 top-0 -z-10 h-24" />
      {/* Viewfinder corners. */}
      <span aria-hidden className={`${CORNER} left-1.5 top-1.5 rounded-tl-md border-l-2 border-t-2`} />
      <span aria-hidden className={`${CORNER} right-1.5 top-1.5 rounded-tr-md border-r-2 border-t-2`} />
      <span aria-hidden className={`${CORNER} bottom-1.5 left-1.5 rounded-bl-md border-b-2 border-l-2`} />
      <span aria-hidden className={`${CORNER} bottom-1.5 right-1.5 rounded-br-md border-b-2 border-r-2`} />
      {/* --- header ------------------------------------------------------ */}
      <div className="relative px-4 pt-4 dt:px-5">
        <SectionHeading compact eyebrow={eyebrow} title={title} action={{ label: 'Tümü', href }}>
          {/* Status LED and a monospaced count, the way a device reports. */}
          <span className="hidden items-center gap-1.5 rounded-full border border-line-strong/70 bg-surface-card px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-secondary xl:inline-flex">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            {String(products.length).padStart(2, '0')} ürün
          </span>
          <div className="flex shrink-0 items-center rounded-full border border-line-strong/70 bg-surface-card p-0.5">
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label={`${title}: önceki ürünler`}
              className={controlBase}
            >
              <ChevronLeft size={16} strokeWidth={1.8} aria-hidden />
            </button>
            <span aria-hidden className="mx-0.5 h-3 w-px bg-line-strong" />
            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page >= pages - 1}
              aria-label={`${title}: sonraki ürünler`}
              className={controlBase}
            >
              <ChevronRight size={16} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </SectionHeading>
      </div>

      {/* --- track -------------------------------------------------------
          Two cards per view once the pair goes side by side; 1.5 on mobile so
          the next card peeks, which is the same affordance the mobile rails
          elsewhere on the page use. Vertical padding gives the hover shadow room
          inside the scroll container, which would otherwise clip it. */}
      <div className="relative mt-1.5 px-4 dt:px-5">
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={`${title} listesi`}
          className="rail auto-cols-[68%] gap-2.5 py-1.5 sm:auto-cols-[46%] lg:auto-cols-[calc(50%_-_5px)]"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>

      {/* --- progress ----------------------------------------------------
          Segments rather than dots: the active one stretches, so the row reads
          as a position indicator instead of decoration. */}
      {/* Only when there is somewhere to go. Below `lg` the paired panels drop
          to one column, the panel gets wider, and the rail can fit every card
          in a single page — at which point `flex-1` stretched the lone segment
          into a 710px bar that looked like a progress indicator for nothing. */}
      {pages > 1 && (
        <div className="mt-auto flex items-center justify-between gap-4 px-4 pb-4 pt-1 dt:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-1 dt:flex-none">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${title}: ${i + 1}. ürün grubu`}
                aria-current={i === page}
                /* On touch the segments share the full row and extend their
                   hit areas vertically. Desktop keeps the compact indicator. */
                className={`relative h-1 rounded-full transition-all duration-(--duration-base) ease-out before:absolute before:inset-x-0 before:-bottom-3 before:-top-7 before:content-[''] dt:flex-none dt:before:-inset-y-2.5 ${
                  i === page
                    ? 'flex-1 bg-text-primary dt:w-6'
                    : 'flex-1 bg-line-strong hover:bg-text-secondary dt:w-3'
                }`}
              />
            ))}
          </div>
          <span aria-hidden className="hidden shrink-0 text-[10px] font-medium leading-[10px] tabular-nums tracking-[0.08em] text-text-secondary dt:block">
            <span className="text-text-primary">{String(page + 1).padStart(2, '0')}</span>
            <span className="mx-1.5 opacity-50">/</span>
            {String(pages).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
}
