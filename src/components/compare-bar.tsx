'use client';
/* eslint-disable @next/next/no-img-element */

/**
 * The floating compare bar — rises from the bottom of every page once a
 * product is in the compare list (the pattern the client liked on VoltEdge).
 *
 * Thumbnails with a remove control, an empty slot per free place, "Temizle",
 * and the way into /karsilastir — disabled until there are two products,
 * because a comparison of one is not one.
 *
 * Not on /karsilastir itself (the page is the bar's destination), and on a
 * product page below `dt` it sits above that page's sticky buy bar instead of
 * on top of it.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Scale, X } from 'lucide-react';

import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { useCompareItems } from '@/components/compare-data';

export function CompareBar() {
  const pathname = usePathname();
  const { state, ready, remove, clear } = useStore();
  const ids = ready ? state.compare : [];
  const { items } = useCompareItems(ids);

  if (!ready || ids.length === 0 || pathname.startsWith('/karsilastir')) return null;
  const onProductPage = pathname.startsWith('/urun/');

  return (
    <div
      role="region"
      aria-label="Karşılaştırma listesi"
      className={`fixed inset-x-3 z-[45] mx-auto max-w-3xl animate-[compare-in_420ms_var(--ease-out)_both] rounded-(--panel-radius) border border-line bg-surface-card/95 p-2.5 shadow-e3 backdrop-blur-xl sm:inset-x-4 dt:bottom-4 ${
        onProductPage ? 'bottom-[76px]' : 'bottom-3'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="hidden shrink-0 items-center gap-2 pl-2 text-[14px] font-bold text-text-primary sm:flex">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-grad-2 to-grad-4 text-white"
          >
            <Scale size={16} strokeWidth={2} />
          </span>
          Karşılaştır
        </span>

        <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto p-1">
          {ids.map((id) => {
            const item = items[id];
            return (
              <li key={id} className="relative shrink-0">
                <Link
                  href={item ? `/urun/${item.slug}` : '/karsilastir'}
                  title={item?.name}
                  className="grid h-12 w-12 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-white p-1"
                >
                  {item ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  ) : (
                    <span aria-hidden className="h-full w-full animate-pulse rounded bg-surface-page" />
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => remove('compare', id)}
                  aria-label={`${item?.name ?? 'Ürünü'} karşılaştırmadan çıkar`}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-white shadow-e1 transition-colors before:absolute before:-inset-2 before:content-[''] hover:bg-danger"
                >
                  <X size={11} strokeWidth={3} aria-hidden />
                </button>
              </li>
            );
          })}
          {Array.from({ length: Math.max(0, COMPARE_LIMIT - ids.length) }).map((_, index) => (
            <li
              key={`slot-${index}`}
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-(--card-radius) border border-dashed border-line-strong text-text-secondary/60"
            >
              <Scale size={15} strokeWidth={1.8} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => clear('compare')}
          className="hidden shrink-0 text-[13px] font-semibold text-text-secondary transition-colors hover:text-text-primary sm:block"
        >
          Temizle
        </button>
        {ids.length >= 2 ? (
          <Link
            href="/karsilastir"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-[14px] font-bold text-white transition-colors hover:bg-brand-dark sm:px-5"
          >
            Karşılaştır ({ids.length})
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
          </Link>
        ) : (
          <span className="flex h-11 shrink-0 items-center rounded-full bg-surface-page px-4 text-[12.5px] font-semibold text-text-secondary">
            1 ürün daha seçin
          </span>
        )}
      </div>
    </div>
  );
}
