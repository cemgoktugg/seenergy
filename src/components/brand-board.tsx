import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface BrandBoardEntry {
  name: string;
  href: string;
  image: string;
}

/** Two rows of two. The widest banner sets the ratio, so cover only crops
 * vertically and keeps the brand lettering at the sides intact. */
export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 dt:gap-5">
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <Link
            href={item.href}
            aria-label={`${item.name} — İncele`}
            className="group relative block aspect-[1600/468] min-h-11 overflow-hidden rounded-xl border border-line-strong/60 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:rounded-[18px] dt:rounded-[22px]"
          >
            <Image
              src={item.image}
              alt={`${item.name} güvenlik sistemleri`}
              fill
              sizes="(min-width: 1600px) 740px, 50vw"
              className="object-cover transition-[filter] duration-(--duration-base) group-hover:brightness-[1.03]"
            />
            <span className="absolute bottom-1 right-1 inline-flex min-h-6 items-center gap-1 rounded-full bg-brand-fixed/90 px-2 text-[10px] font-semibold text-white shadow-e1 ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-(--duration-fast) group-hover:bg-brand-fixed sm:bottom-3 sm:right-3 sm:min-h-9 sm:gap-2 sm:px-4 sm:text-[12px] dt:bottom-4 dt:right-4 dt:min-h-10 dt:px-5 dt:text-[13px]">
              İncele
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden className="h-3 w-3 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
