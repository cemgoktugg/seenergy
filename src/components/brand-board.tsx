import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface BrandBoardEntry {
  name: string;
  href: string;
  image: StaticImageData;
}

/** One frame ratio, 5:1, aligns all four cards — and it is the banners' own
 * ratio (public/brand-banners/*-wide.webp), so the picture fills the frame
 * edge to edge with nothing cropped. The action stays below it on mobile and
 * at bottom left on desktop. */
export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 dt:gap-5">
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <Link
            href={item.href}
            aria-label={`${item.name} — İncele`}
            className="group relative block rounded-xl border border-line-strong/60 bg-surface-card shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:rounded-[18px] dt:rounded-[22px]"
          >
            <span className="relative block aspect-[5/1] overflow-hidden rounded-t-[inherit] lg:rounded-[inherit]">
              <Image
                src={item.image}
                alt={`${item.name} güvenlik sistemleri`}
                fill
                sizes="(min-width: 1600px) 592px, 40vw"
                className="rounded-[inherit] object-cover transition-[filter] duration-(--duration-base) group-hover:brightness-[1.03]"
              />
            </span>
            <span className="relative my-1 mr-1 ml-auto flex min-h-6 w-fit items-center gap-1 rounded-full bg-brand-fixed/90 px-2 text-[10px] font-semibold text-white shadow-e1 ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-(--duration-fast) group-hover:bg-brand-fixed lg:absolute lg:bottom-2 lg:left-3 lg:m-0 lg:min-h-7 lg:gap-1.5 lg:px-3 lg:text-[11px] dt:left-4 dt:min-h-8 dt:gap-2 dt:px-4 dt:text-[12px]">
              İncele
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden className="h-3 w-3 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
