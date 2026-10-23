import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface BrandBoardEntry {
  name: string;
  href: string;
  image: StaticImageData;
}

/**
 * The client's four brand banners, shown exactly as supplied (img/1-4.jpeg)
 * — no cut, no padding, no extended edges.
 *
 * The banners do not share a ratio (2.95 to 3.42 : 1), so one frame ratio for
 * all four would either crop them or leave white bars. Instead each row is
 * justified: every frame takes its own banner's ratio, and the two cards of a
 * row share its width in proportion to those ratios (`flex-grow` = ratio over
 * a zero basis), which gives both the same height and fills the row. The
 * picture therefore fits its frame exactly; `object-fill` absorbs the 1-2%
 * next/image's rounded resize heights add, so not a pixel is cropped. Rows can differ in height by a
 * few pixels when their banners do.
 *
 * The action stays below the picture on mobile and at bottom left on desktop.
 */
export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  const rows: BrandBoardEntry[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));

  return (
    <ul className="flex flex-col gap-3 sm:gap-4 dt:gap-5">
      {rows.map((row) => (
        <li key={row.map((item) => item.href).join()} className="flex gap-3 sm:gap-4 dt:gap-5">
          {row.map((item) => {
            const ratio = item.image.width / item.image.height;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={`${item.name} — İncele`}
                style={{ flexGrow: ratio, flexBasis: 0 }}
                className="group relative block min-w-0 rounded-xl border border-line-strong/60 bg-surface-card shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:rounded-[18px] dt:rounded-[22px]"
              >
                <span
                  style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}
                  className="relative block overflow-hidden rounded-t-[inherit] lg:rounded-[inherit]"
                >
                  <Image
                    src={item.image}
                    alt={`${item.name} güvenlik sistemleri`}
                    fill
                    sizes="(min-width: 1600px) 740px, 50vw"
                    className="rounded-[inherit] object-fill transition-[filter] duration-(--duration-base) group-hover:brightness-[1.03]"
                  />
                </span>
                <span className="relative my-1 mr-1 ml-auto flex min-h-6 w-fit items-center gap-1 rounded-full bg-brand-fixed/90 px-2 text-[10px] font-semibold text-white shadow-e1 ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-(--duration-fast) group-hover:bg-brand-fixed lg:absolute lg:bottom-2 lg:left-3 lg:m-0 lg:min-h-7 lg:gap-1.5 lg:px-3 lg:text-[11px] dt:left-4 dt:min-h-8 dt:gap-2 dt:px-4 dt:text-[12px]">
                  İncele
                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                    aria-hidden
                    className="h-3 w-3 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                  />
                </span>
              </Link>
            );
          })}
        </li>
      ))}
    </ul>
  );
}
