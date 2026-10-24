'use client';

/**
 * Compact product slider — two of these sit side by side directly under the
 * brand banners. The client asked for product rails there instead of the
 * reference's campaign strip, so this component is ours rather than a
 * measured reproduction: it is built from this project's tokens and the
 * existing ProductCard, not from reference geometry.
 *
 * LOOK (2026-10-23, after a red/blue pair and a light grid were both turned
 * down as plain): a security control-room monitor. Each panel is a dark
 * graphite screen lit from its top-left corner, with
 *   - a channel readout in the bottom corner — "CH 01" / "CH 02", the
 *     product count and the page, in monospace, the way a CCTV monitor labels
 *     a feed (in the footer row, so the panel stays as short as the client
 *     asked for). A red "CANLI" light was there and was removed: these are
 *     not live feeds, and the client asked why it said so;
 *   - viewfinder corner marks, the site's dot matrix in light ink, and a slow
 *     scan line passing behind the cards;
 *   - the running light round its frame that the brand banners above carry
 *     (`.brand-frame`), in steel, so the two bands read as one system.
 * The white product cards sit on it like feeds on a wall of screens. Both
 * panels are identical; nothing is colour-coded. The panel stays dark in
 * both themes. Motion stops under reduced motion.
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

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import type { Product } from '@/data/catalog';

const CORNER = 'pointer-events-none absolute h-3.5 w-3.5 border-white/35';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProductSlider({
  title,
  eyebrow,
  href,
  products,
  channel,
}: {
  title: string;
  eyebrow: string;
  href: string;
  products: Product[];
  /** The monitor channel this panel shows, e.g. "01". */
  channel: string;
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
    'grid h-11 w-11 place-items-center rounded-full text-white transition-colors duration-(--duration-fast) enabled:hover:bg-white enabled:hover:text-ink-fixed disabled:cursor-not-allowed disabled:opacity-30 dt:h-8 dt:w-8';

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      /* The running frame light of the brand banners above, in steel. Out of
         step with them (the delay) so the page does not pulse in unison. */
      style={{ '--frame-accent': '#c9ced6', animationDelay: `${channel === '01' ? -2.1 : -4.9}s` } as CSSProperties}
      className="brand-frame flex h-full min-w-0 flex-col rounded-(--panel-radius) p-[1.5px] shadow-e2"
    >
      <div
        style={{ '--tech-ink': '#ffffff' } as CSSProperties}
        className="relative isolate flex h-full flex-col overflow-hidden rounded-(--panel-radius) bg-[radial-gradient(130%_100%_at_0%_0%,#323844_0%,#191c23_45%,#0e1014_100%)] text-white"
      >
        {/* Behind everything: the dot matrix, a corner glow, the scan line. */}
        <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <span aria-hidden className="pointer-events-none absolute -left-24 -top-28 -z-10 h-64 w-64 rounded-full bg-white/[0.07] blur-3xl" />
        <span aria-hidden className="tech-scan pointer-events-none absolute inset-x-0 top-0 -z-10 h-32" />
        {/* Viewfinder corners. */}
        <span aria-hidden className={`${CORNER} left-2 top-2 rounded-tl-(--card-radius) border-l-2 border-t-2`} />
        <span aria-hidden className={`${CORNER} right-2 top-2 rounded-tr-(--card-radius) border-r-2 border-t-2`} />
        <span aria-hidden className={`${CORNER} bottom-2 left-2 rounded-bl-(--card-radius) border-b-2 border-l-2`} />
        <span aria-hidden className={`${CORNER} bottom-2 right-2 rounded-br-(--card-radius) border-b-2 border-r-2`} />

        {/* --- header ---------------------------------------------------- */}
        <div className="relative px-4 pt-4 dt:px-5">
          <SectionHeading compact tone="dark" eyebrow={eyebrow} title={title} action={{ label: 'Tümü', href }}>
            <div className="flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.06] p-0.5 backdrop-blur">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page === 0}
                aria-label={`${title}: önceki ürünler`}
                className={controlBase}
              >
                <ChevronLeft size={16} strokeWidth={1.8} aria-hidden />
              </button>
              <span aria-hidden className="mx-0.5 h-3 w-px bg-white/20" />
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

        {/* --- track -----------------------------------------------------
            Two cards per view once the pair goes side by side; 1.5 on mobile
            so the next card peeks. Vertical padding gives the hover shadow
            room inside the scroll container, which would otherwise clip it. */}
        <div className="relative mt-2 px-4 dt:px-5">
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

        {/* --- progress --------------------------------------------------
            Only when there is somewhere to go: below `lg` the panel gets wider
            and the rail can fit every card in one page. */}
        <div className="mt-auto flex items-center justify-between gap-4 px-4 pb-4 pt-1.5 dt:px-5">
          {pages > 1 ? (
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
                    i === page ? 'flex-1 bg-white dt:w-6' : 'flex-1 bg-white/20 hover:bg-white/45 dt:w-3'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
          {/* The channel readout, the way a CCTV monitor labels its feed. */}
          <p className="flex shrink-0 items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
            <span className="rounded-(--card-radius) border border-white/15 bg-white/5 px-1.5 py-[3px] text-white/75">CH {channel}</span>
            <span className="hidden sm:inline">{String(products.length).padStart(2, '0')} ürün</span>
            {pages > 1 ? (
              <span aria-hidden className="hidden tabular-nums text-white/45 dt:inline">
                <span className="text-white">{String(page + 1).padStart(2, '0')}</span>
                <span className="mx-1 opacity-50">/</span>
                {String(pages).padStart(2, '0')}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
