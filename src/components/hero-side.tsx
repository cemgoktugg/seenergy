/* eslint-disable @next/next/no-img-element */
/**
 * The tower beside the hero.
 *
 * WHY IT EXISTS
 *
 * The top of the page was one 1320×423 slide: a single entry point, which
 * reads as an advertisement rather than a shop. Two stacked tiles beside it
 * turn the first screen into three destinations without making it taller — the
 * band keeps its measured 423px, the slide simply stops owning all of it.
 *
 * LAYOUT
 *
 * From `dt` the two tiles stack vertically and fill the row's height, so the
 * hero's 423px is shared rather than extended. Below `dt` they sit side by side
 * under the hero as a short pair — NOT hidden. Hiding them would take two real
 * destinations away from the viewport where navigation is hardest, which is the
 * opposite of the point.
 *
 * A server component: links and images, no state.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HERO_SIDE } from '@/data/site';

export function HeroSide() {
  return (
    <div className="grid grid-cols-2 gap-(--space-grid-gap) dt:h-full dt:grid-cols-1 dt:grid-rows-2">
      {HERO_SIDE.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group/tile relative block aspect-[172/104] overflow-hidden rounded-(--panel-radius) sm:aspect-[340/120] dt:aspect-auto dt:h-full"
        >
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-out group-hover/tile:scale-[1.04]"
            loading="eager"
          />

          {/* Same two-layer treatment as the hero: a legibility scrim weighted
              to the copy side, then the logo gradient as a low wash so these
              read as part of the same surface rather than two stray banners. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-chrome/92 via-chrome/60 to-chrome/25"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-grad-1/20 via-grad-3/10 to-grad-4/20 mix-blend-screen"
          />

          <div className="absolute inset-0 flex flex-col justify-center px-3.5 dt:px-6">
            <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/75 dt:text-[10px]">
              <span
                aria-hidden
                className="h-[3px] w-3.5 rounded-full bg-linear-to-r from-grad-1 to-grad-4 dt:w-5"
              />
              {item.eyebrow}
            </p>

            <p className="mt-1 max-w-[80%] text-[13px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[16px] dt:mt-2 dt:text-[20px]">
              {item.title}
            </p>

            <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-white/85 transition-colors duration-(--duration-fast) group-hover/tile:text-white dt:mt-3 dt:text-[12px]">
              İncele
              <ArrowRight
                size={12}
                strokeWidth={2.5}
                aria-hidden
                className="transition-transform duration-(--duration-base) ease-out group-hover/tile:translate-x-0.5"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
