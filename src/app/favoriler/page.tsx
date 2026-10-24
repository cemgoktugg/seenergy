'use client';

/**
 * Favourites — `/favoriler`.
 *
 * The same store the heart buttons write to, on the product page and on every
 * listing card. Client-rendered because the list is client state: it lives in
 * this browser and is never sent anywhere.
 *
 * `noindex` is set in this route's `layout.tsx` rather than here, because a
 * client component cannot export `metadata`; the docs put wishlist, cart,
 * compare and search in the noindex set (INFORMATION_ARCHITECTURE §2).
 */

import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

import { useStore } from '@/components/cart-store';
import { ProductGrid } from '@/components/sections';
import { useCatalog } from '@/components/catalog-provider';

export default function FavouritesPage() {
  const { state, ready, clear } = useStore();
  const { byId } = useCatalog();

  const products = state.favourites
    .map((id) => byId(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (ready && products.length === 0) {
    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-xl text-center">
          <span
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-text"
          >
            <Heart size={22} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
            Favori listeniz boş
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün kartlarındaki kalp simgesine dokunarak liste oluşturabilirsiniz.
            Liste yalnızca bu tarayıcıda saklanır.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 h-13 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <ArrowLeft size={17} strokeWidth={2} aria-hidden />
            Ürünlere göz at
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-text-secondary">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Favoriler
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
            Favorilerim
          </h1>
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => clear('favourites')}
              className="text-[13px] font-semibold text-text-secondary underline underline-offset-2 transition-colors hover:text-danger-ink"
            >
              Listeyi temizle
            </button>
          )}
        </div>
        <p className="mt-2 text-[14px] text-text-secondary">
          <span className="font-extrabold tabular-nums text-text-primary">{products.length}</span>{' '}
          ürün · yalnızca bu tarayıcıda saklanır
        </p>
      </section>

      <section className="container-main pb-12 pt-4 dt:pt-6" aria-label="Favori ürünler">
        {/* A saved list is read, not skimmed past — same reasoning as the
            category listing, so the same `grid` layout rather than a rail. */}
        <ProductGrid products={products} columns={4} layout="grid" />
      </section>
    </>
  );
}
