/* eslint-disable @next/next/no-img-element */
/**
 * Category mosaic — the department board.
 *
 * WHY IT SITS HERE, AND WHY IT IS NOT A ROW OF CARDS
 *
 * Two measurements drove this module. First, category discovery used to live at
 * y=7337 on a 10.050px homepage — 73% of the way down, behind ~6.000px of
 * product rows. For a technical storefront the first question is "which
 * department", and it was the last thing answered.
 *
 * Second, 60% of the homepage was product-card rows and 38% of it was seven
 * near-identical brand bands. Adding a ninth row of four equal cards would have
 * deepened exactly the monotony this is meant to break. So the layout is
 * deliberately uneven: one 2x2 feature cell carrying artwork, the rest compact
 * cells carrying an icon and a label.
 *
 * THE COUNT. The client's tree has fourteen top-level categories. Six columns
 * by three rows is eighteen slots: the feature takes four, thirteen categories
 * take thirteen, and the last slot is "Tüm Kategoriler" — the full tree with
 * its subcategories, which is where someone goes when the board is not
 * enough. It fits exactly; the earlier five-column board was cut for twelve.
 *
 * Below `dt` the spanning is dropped entirely: on a phone an asymmetric mosaic
 * is just an inconsistent list, so it becomes two even columns.
 *
 * Content is PRIMARY_NAV — the category tree the navigation already uses, with
 * the same hrefs. Nothing here is a new claim or a new destination.
 *
 * A server component: links and one image.
 */

import Link from 'next/link';
import { ArrowRight, ChevronRight, LayoutGrid } from 'lucide-react';

import { CATEGORY_ICONS } from '@/components/category-icons';
import { PRIMARY_NAV } from '@/data/site';

/** The artwork for the one feature cell. A transparent cutout, so it sits on
 *  the gradient without bringing a plate of its own. */
const FEATURE_ART = '/mock/products/cutout/dome-white.svg';

const CELL =
  'group/c flex min-h-11 items-center gap-2.5 rounded-(--panel-radius) border px-3.5 py-3 transition-colors duration-(--duration-fast) ease-in-out dt:px-4';

export function CategoryMosaic() {
  const [feature, ...rest] = PRIMARY_NAV;

  return (
    <div className="grid grid-cols-2 gap-(--space-grid-gap) dt:auto-rows-[96px] dt:grid-cols-6">
      {/* Feature cell: two columns by two rows from `dt`, the only cell with
          artwork and the only one on brand colour. */}
      <Link
        href={feature.href}
        /* `min-h-[132px]` below `dt`: with no row span to give it height there,
           the cell collapsed to its content and measured 86px — a squat strip
           rather than the feature the eyebrow, title and call to action were
           written for. From `dt` the 2x2 span sets the height instead. */
        className="group/f relative col-span-2 flex min-h-[132px] flex-col justify-between overflow-hidden rounded-(--panel-radius) bg-linear-to-br from-grad-2 via-grad-3 to-grad-4 p-4 dt:min-h-0 dt:row-span-2 dt:p-5"
      >
        <img
          src={FEATURE_ART}
          alt=""
          className="pointer-events-none absolute -bottom-2 right-0 h-[62%] w-[52%] object-contain object-right-bottom opacity-90 transition-transform duration-(--duration-slow) ease-out group-hover/f:scale-105 dt:h-[58%]"
          loading="lazy"
        />
        <p className="relative flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75 dt:text-[10px]">
          <span aria-hidden className="h-[3px] w-4 rounded-full bg-white/70 dt:w-6" />
          Kategoriler
        </p>
        <span className="relative">
          <span className="block max-w-[74%] text-[16px] font-extrabold leading-[1.12] tracking-tight text-white dt:text-[20px]">
            {feature.label}
          </span>
          {feature.children && (
            <span className="mt-1 block max-w-[60%] text-[11px] leading-snug text-white/70 dt:text-[12px]">
              {feature.children.map((child) => child.label).join(' · ')}
            </span>
          )}
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-white/85 transition-colors duration-(--duration-fast) group-hover/f:text-white dt:mt-2.5 dt:text-[12px]">
            İncele
            <ArrowRight
              size={12}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform duration-(--duration-base) ease-out group-hover/f:translate-x-0.5"
            />
          </span>
        </span>
      </Link>

      {/* The other thirteen: an icon and a label, and a subcategory count
          where there are subcategories — the board says the tree goes deeper
          before anyone opens the menu. */}
      {rest.map((item) => {
        const Icon = CATEGORY_ICONS[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            /* `min-h-11`, because padding alone measured 42px and these cells
               are the page's primary navigation — the one place a 2px shortfall
               is least acceptable. From `dt` the 96px auto-row governs. */
            className={`${CELL} border-line bg-surface-card shadow-e1 hover:border-brand hover:bg-brand-soft`}
          >
            {Icon && (
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand/8 text-brand-text transition-colors duration-(--duration-fast) group-hover/c:bg-brand group-hover/c:text-white"
              >
                <Icon size={16} strokeWidth={1.9} />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-[1.25] text-text-primary dt:text-[14px]">
                {item.label}
              </span>
              {item.children && (
                <span className="mt-0.5 block text-[11px] text-text-secondary">
                  {item.children.length} alt kategori
                </span>
              )}
            </span>
            <ChevronRight
              size={15}
              strokeWidth={2.25}
              aria-hidden
              className="ml-auto shrink-0 text-text-secondary transition-transform duration-(--duration-base) ease-out group-hover/c:translate-x-0.5 group-hover/c:text-brand-dark"
            />
          </Link>
        );
      })}

      {/* The eighteenth slot: the whole tree. */}
      <Link href="/kategori" className={`${CELL} border-dashed border-line-strong bg-surface-page hover:border-brand hover:bg-brand-soft`}>
        <span
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand text-white"
        >
          <LayoutGrid size={16} strokeWidth={1.9} />
        </span>
        <span className="min-w-0 text-[13px] font-bold leading-[1.25] text-text-primary dt:text-[14px]">
          Tüm Kategoriler
        </span>
        <ChevronRight
          size={15}
          strokeWidth={2.25}
          aria-hidden
          className="ml-auto shrink-0 text-text-secondary transition-transform duration-(--duration-base) ease-out group-hover/c:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
