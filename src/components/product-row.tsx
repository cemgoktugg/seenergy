/* eslint-disable @next/next/no-img-element */
/**
 * Compact product row — the vertical form of a product, for rails that sit
 * beside content rather than under it.
 *
 * The card is 357px tall; eight of them down a sidebar would be a second page.
 * This is the same information at a quarter of the height: thumbnail, brand,
 * name, price. No hover cart bar — a sidebar rail is for navigating to a
 * product, not for buying from a list.
 */

import Link from 'next/link';

import { priceLabel, type Product } from '@/data/catalog';
import { imageProps } from '@/lib/image';

export function ProductRow({ product }: { product: Product }) {
  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex items-center gap-3 rounded-(--card-radius) border border-transparent p-2 transition-colors duration-(--duration-fast) hover:border-line hover:bg-surface-page"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-surface-card">
        <img
          {...imageProps(product.image, 56)}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="h-full w-full object-contain p-1"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-bold text-text-secondary">
          {product.brand}
        </span>
        <span className="line-clamp-2 text-[13px] leading-[1.35] text-text-primary transition-colors group-hover:text-brand-text">
          {product.name}
        </span>
        <span className={`mt-0.5 block font-extrabold tabular-nums text-text-primary ${product.price == null ? 'text-[12px]' : 'text-[14px]'}`}>
          {priceLabel(product.price)}
        </span>
      </span>
    </Link>
  );
}
