import Image from 'next/image';
import Link from 'next/link';

export interface BrandBoardEntry {
  name: string;
  href: string;
  image: string;
}

/** The supplied brand banners form two rows of two, including on phones. */
export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 dt:gap-5">
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <Link
            href={item.href}
            aria-label={`${item.name} marka sayfasını aç`}
            className="group relative block aspect-[3/1] overflow-hidden rounded-xl border border-line-strong/60 bg-white shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 sm:rounded-[18px] dt:rounded-[22px]"
          >
            <Image
              src={item.image}
              alt={`${item.name} güvenlik sistemleri`}
              fill
              sizes="(min-width: 1600px) 740px, 50vw"
              className="object-contain transition-[filter] duration-(--duration-base) group-hover:brightness-[1.03]"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
