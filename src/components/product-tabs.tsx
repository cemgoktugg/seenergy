'use client';

/**
 * Tabbed product block — brief §22.
 *
 * The reference devotes 1194px of its 6045px homepage to this section and the
 * previous local build omitted it entirely, which was the single largest
 * structural gap on the page.
 *
 * Measured target (docs/MERTER_REFERENCE_BLUEPRINT.md §5.4), 1440 viewport:
 *
 *   strip      1320 × 48   three pills, each 432 × 48, gap 8, radius 10
 *   active     bg rgb(248,158,30)  text #fff  14px / 700
 *   inactive   bg rgb(221,221,221) text #000  14px / 400
 *   panel      5 columns × 3 rows = 15 products
 *
 * Switching is a class swap — the reference re-renders the panel with no slide
 * and no elaborate motion, so this does the same. Brief §23: reference
 * behaviour wins; only the easing is smoothed.
 *
 * On mobile the strip scrolls horizontally with the pills keeping their size,
 * exactly as observed at 390 (the second pill is clipped at the right edge).
 */

import { useId, useState } from 'react';

import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import type { Product } from '@/data/catalog';

export type ProductTab = {
  id: string;
  label: string;
  products: Product[];
};

export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const baseId = useId();

  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section aria-label="Öne çıkan ürün listeleri">
      {/* The block had no heading at all — three tab labels were the only
          words over a twelve-card grid. */}
      <div className="mb-3 dt:mb-5">
        <SectionHeading eyebrow="Keşfet" title="Öne Çıkan Ürünler" />
      </div>
      {/* --- tab strip --------------------------------------------------
          The reference strip is three full-width filled pills — grey when
          idle, amber when active. Restated as underlined text tabs at the
          client's request: it matches the accent-tick section headers the rest
          of the page now uses, and it stops three heavy grey slabs from
          competing with the products underneath.

          Still horizontally scrollable on mobile, on the same `rail` utility
          the other scrollers use. */}
      {/* Two columns from `dt`: a vertical tab rail beside the grid.
          At 1236px this was the largest single band on the homepage, and a
          5x3 block of cards under a horizontal strip is the same shape as
          everything above it. Standing the tabs up breaks that — it is the one
          vertical element in a page made of horizontal rows, and it turns three
          underlined words that read as passive labels into a list that reads as
          a choice. */}
      <div className="dt:grid dt:grid-cols-[196px_minmax(0,1fr)] dt:gap-(--space-grid-gap)">
        <div
          role="tablist"
          aria-label="Ürün listeleri"
          className="rail rail-stack-dt auto-cols-max gap-5 border-b border-line dt:gap-1 dt:border-b-0"
        >
          {tabs.map((tab) => {
            const selected = tab.id === current.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                onClick={() => setActive(tab.id)}
                /* `pb-4 pt-2` below `dt`, not `pb-3 pt-1`: measured at 390 the
                   pills came out 37px tall, under the touch floor. Padding
                   rather than `min-h-11`, because a minimum height would push
                   the underline away from the label instead of growing the
                   whole target. 8 + 20 + 16 = 44. `dt:py-3` takes over above. */
                className={`relative whitespace-nowrap px-1 pb-4 pt-2 text-[14px] tracking-tight transition-colors duration-(--duration-fast) ease-in-out dt:w-full dt:rounded-(--card-radius) dt:px-3.5 dt:py-3 dt:text-left dt:text-[16px] ${
                  selected
                    ? 'font-extrabold text-text-primary dt:bg-brand-soft'
                    : 'font-medium text-text-secondary hover:text-text-primary dt:hover:bg-surface-page'
                }`}
              >
                {tab.label}
                {selected && (
                  /* Underline below `dt`, a left edge above it — the indicator
                     follows the axis the list runs on. */
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-brand dt:inset-x-auto dt:inset-y-1.5 dt:left-0 dt:h-auto dt:w-[3px] dt:bg-linear-to-b dt:from-grad-1 dt:to-grad-4"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* --- panel ----------------------------------------------------
            Four columns beside the rail from `dt`, a grid of four from `lg`.
            Below `lg` it is ONE swipeable row: twelve cards two-up was six
            rows, 2,330px of a 10,258px phone page. The column width shows a
            third card's edge so the row reads as scrollable.
            `key` forces a fresh subtree per tab so the cards re-mount rather
            than reusing hover state from the previous list. */}
        <div
          key={current.id}
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
          className="rail rail-rows-lg auto-cols-[44%] gap-(--space-grid-gap) pt-(--space-grid-gap) sm:auto-cols-[30%] lg:grid-cols-4 dt:pt-0"
        >
          {current.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
