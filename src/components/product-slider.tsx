'use client';

/**
 * Compact product slider — two of these sit side by side directly under the
 * hero, in the band the reference gives to its 4-tile campaign strip. The
 * client asked for product rails there instead, so this component is ours
 * rather than a measured reproduction: it is built from this project's tokens
 * and the existing ProductCard, not from reference geometry.
 *
 * Design notes:
 *   - The panel reads as one object: a 3px accent gradient capping a bordered
 *     white card, a muted eyebrow above a tight heading, ghost arrow controls
 *     that fill with the accent on hover, and a segmented progress pill row.
 *   - Two accents keep the pair distinguishable at a glance without inventing
 *     colours: `warm` is the brand orange, `cool` the info blue / deep navy.
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

type Accent = 'violet' | 'teal';

/**
 * Every accent value resolves to a theme token — no literal colours here.
 *
 * The two accents are the two ends of the SEENERGY gradient, so the pair reads
 * as one identity rather than two decisions. Fills that carry white text use
 * the indigo and blue stops (8.4:1 and 5.9:1); the teal stop is only ever
 * graphics — a rule, a dot, a progress segment — because white on teal is
 * 2.8:1 and would fail as a label.
 */
const ACCENTS: Record<
  Accent,
  { rule: string; wash: string; control: string; segment: string }
> = {
  violet: {
    rule: 'from-grad-3 to-grad-4',
    wash: 'from-brand-soft/70',
    control: 'enabled:hover:border-brand enabled:hover:bg-brand enabled:hover:text-white',
    segment: 'bg-grad-3',
  },
  teal: {
    rule: 'from-grad-1 to-grad-2',
    wash: 'from-grad-1/8',
    control: 'enabled:hover:border-grad-2 enabled:hover:bg-grad-2 enabled:hover:text-white',
    segment: 'bg-grad-2',
  },
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ProductSlider({
  title,
  eyebrow,
  href,
  products,
  accent = 'violet',
}: {
  title: string;
  eyebrow: string;
  href: string;
  products: Product[];
  accent?: Accent;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const a = ACCENTS[accent];

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
    'grid h-8 w-8 place-items-center rounded-full border border-line-strong bg-surface-card text-text-secondary transition-colors duration-(--duration-fast) ease-in-out disabled:cursor-not-allowed disabled:opacity-30 dt:h-9 dt:w-9';

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="flex h-full flex-col overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
    >
      {/* Accent cap — the one saturated element, 3px tall. */}
      <span aria-hidden className={`block h-[3px] w-full bg-linear-to-r ${a.rule}`} />

      {/* --- header ------------------------------------------------------ */}
      <div
        className={`flex items-center justify-between gap-3 bg-linear-to-b to-transparent px-3 pt-3 dt:px-4 dt:pt-4 ${a.wash}`}
      >
        <div className="min-w-0 flex-1">
          <SectionHeading eyebrow={eyebrow} title={title} action={{ label: 'Tümü', href }}>
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label={`${title}: önceki ürünler`}
            className={`${controlBase} ${a.control}`}
          >
            <ChevronLeft size={17} strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= pages - 1}
            aria-label={`${title}: sonraki ürünler`}
            className={`${controlBase} ${a.control}`}
          >
            <ChevronRight size={17} strokeWidth={2.25} aria-hidden />
          </button>
          </SectionHeading>
        </div>
      </div>

      {/* --- track -------------------------------------------------------
          Two cards per view once the pair goes side by side; 1.5 on mobile so
          the next card peeks, which is the same affordance the mobile rails
          elsewhere on the page use. `py-2` gives the cards' hover shadow room
          inside the scroll container, which would otherwise clip it. */}
      <div className="mt-2 px-3 dt:px-4">
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={`${title} listesi`}
          className="rail auto-cols-[68%] gap-2.5 py-2 sm:auto-cols-[46%] lg:auto-cols-[calc(50%_-_5px)]"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
        <div className="mt-auto flex items-center gap-2 px-3 pb-3 pt-1 dt:gap-1 dt:px-4 dt:pb-4">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${title}: ${i + 1}. ürün grubu`}
            aria-current={i === page}
            /* These hit-tested 10×6 and 24×6 against a 44px floor — the same
               failure the hero dots had, in the same shape of control.
               Below `dt` the bar therefore carries the target: `flex-1` rather
               than a fixed 44px, because these are narrow paired panels with up
               to 6 pages, where fixed widths would overflow the panel. Equal
               shares always fit and clear 44 whenever the panel has the room.
               `before` supplies the height, and it is deliberately
               ASYMMETRIC: a symmetric -inset-y-5 hit-tested at 38px, because
               the panel's own `overflow-hidden` cuts the extension off at the
               12px bottom padding. Downward there are only those 12px to take,
               so the rest is taken upward — 6 + 28 + 12 = 46.
               From `dt` up a pointer is driving and the compact
               active-stretches look returns. */
            className={`relative h-1.5 rounded-full transition-all duration-(--duration-base) ease-out before:absolute before:inset-x-0 before:-bottom-3 before:-top-7 before:content-[''] dt:flex-none ${
              i === page
                ? `flex-1 dt:w-6 ${a.segment}`
                : 'flex-1 bg-line-strong hover:bg-text-secondary dt:w-2.5'
            }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
