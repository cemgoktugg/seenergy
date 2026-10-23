import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface BrandBoardEntry {
  name: string;
  href: string;
  image: StaticImageData;
}

/** Scale the artwork to 80% width at its intrinsic ratio: 20% less height,
 * no cropping. The remaining width holds the action clear of the products. */
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
            <Image
              src={item.image}
              alt={`${item.name} güvenlik sistemleri`}
              sizes="(min-width: 1600px) 592px, 40vw"
              className="block h-auto w-4/5 rounded-l-[inherit] transition-[filter] duration-(--duration-base) group-hover:brightness-[1.03]"
            />
            <span className="absolute inset-y-0 right-0 flex w-1/5 items-center justify-center rounded-r-[inherit] border-l border-line-strong/40 bg-surface-page transition-colors duration-(--duration-fast) group-hover:bg-surface-utility">
              <span className="inline-flex flex-col items-center justify-center gap-0.5 text-[8px] leading-3 font-semibold text-text-primary min-[360px]:text-[9px] sm:gap-1 sm:text-[11px] sm:leading-4 lg:flex-row lg:gap-1.5 lg:rounded-full lg:bg-brand-fixed/90 lg:px-3 lg:py-2.5 lg:text-[12px] lg:text-white lg:shadow-e1 lg:transition-colors lg:duration-(--duration-fast) lg:group-hover:bg-brand-fixed dt:gap-2 dt:px-4 dt:text-[13px]">
                İncele
                <ArrowRight size={14} strokeWidth={1.8} aria-hidden className="h-3 w-3 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
