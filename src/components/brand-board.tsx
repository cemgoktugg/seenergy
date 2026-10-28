import type { CSSProperties } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface BrandBoardEntry {
  name: string;
  href: string;
  /** The banner — admin → Vitrin → Marka panosu (a URL), or a static import. */
  image: StaticImageData | string;
  /** The brand's own colour, for the light running round the frame. */
  accent: string;
}

/**
 * The client's four brand banners (img/1-4.jpeg), two by two.
 *
 * ALIGNMENT. The client wants the two rows to line up column for column, so
 * all four frames share one ratio, 3 : 1. The banners (replaced 2026-10-23)
 * run 2.72 to 3.00 : 1 with their products in the middle and the ground
 * running to every edge, so the picture is centred: 2 and 3 fit exactly,
 * Neutron (4) loses ~4px top and bottom (of 542) and Dahua (1) 28px top and
 * bottom (of 589) — no logo, word or product is touched. When a banner is
 * replaced, check its ratio against this. (A justified layout that showed
 * every banner whole was tried and taken back: its columns did not line up.)
 *
 * MOTION. Each frame carries a light in the brand's colour that runs round
 * its border (`.brand-frame` in globals.css), the four out of step so they
 * do not pulse together, and a shine sweeps the banner on hover. Both stop
 * under reduced motion.
 *
 * The action stays below the picture on mobile and at bottom left on desktop.
 */
export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 dt:gap-5">
      {items.map((item, index) => (
        <li key={item.href} className="min-w-0">
          <Link
            href={item.href}
            aria-label={`${item.name} — İncele`}
            style={{ '--frame-accent': item.accent, animationDelay: `${-index * 1.4}s` } as CSSProperties}
            className="brand-frame group relative block rounded-(--card-radius) p-[2px] shadow-e1 transition-[transform,box-shadow] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-e3 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:rounded-(--panel-radius) dt:rounded-(--panel-radius)"
          >
            <span className="relative block overflow-hidden rounded-(--card-radius) bg-surface-card sm:rounded-(--panel-radius) dt:rounded-(--panel-radius)">
              <span className="relative block aspect-[3/1] overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.name} güvenlik sistemleri`}
                  fill
                  sizes="(min-width: 1600px) 740px, 50vw"
                  className="object-cover object-center transition-[filter] duration-(--duration-base) group-hover:brightness-[1.04]"
                />
                {/* The hover shine: a soft band crossing the banner once. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-[20deg] bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1100ms] ease-out motion-reduce:hidden group-hover:translate-x-[620%]"
                />
              </span>
              <span className="relative my-1 mr-1 ml-auto flex min-h-6 w-fit items-center gap-1 rounded-full bg-brand-fixed/90 px-2 text-[12px] font-semibold text-white shadow-e1 ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-(--duration-fast) group-hover:bg-brand-fixed lg:absolute lg:bottom-2 lg:left-3 lg:m-0 lg:min-h-7 lg:gap-1.5 lg:px-3 dt:left-4 dt:min-h-8 dt:gap-2 dt:px-4">
                İncele
                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  aria-hidden
                  className="h-3 w-3 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
