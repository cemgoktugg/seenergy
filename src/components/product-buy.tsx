'use client';

/**
 * The product page's interactive block: add to cart, favourite, and the mobile
 * sticky buy bar.
 *
 * Split out of the page so the page itself stays a server component — only the
 * two controls that hold state cross into the client.
 *
 * The sticky bar is the reason this storefront has no mobile bottom navigation
 * (docs/INFORMATION_ARCHITECTURE §8); that decision assumes this bar exists, so
 * it is part of the page rather than an enhancement.
 */

import Link from 'next/link';
import { Heart, MessageSquareQuote, Scale, ShoppingCart } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { priceLabel, type Product } from '@/data/catalog';

export function ProductBuy({ product }: { product: Product }) {
  /* The cart is Medusa's, shared through CartProvider: the header badge, the
     cards and the cart page all read the same response this button updates. */
  const cart = useCart();
  const inCart = cart.quantityOf(product.variantId);
  const { has, toggle, count, ready } = useStore();
  const favourite = ready && has('favourites', product.id);
  const comparing = ready && has('compare', product.id);
  /* The limit is enforced in the store; surfacing it here stops the control
     from looking broken when a fifth product silently refuses to be added. */
  const compareFull = ready && !comparing && count('compare') >= COMPARE_LIMIT;
  /* No price yet: the product is quoted, not sold — no cart controls. */
  const onRequest = product.price == null;
  const soldOut = product.stock === 0;
  /* Stock is enforced by Medusa; stopping at the known level here just saves
     the visitor a round trip to an error. */
  const atStock = !soldOut && inCart >= product.stock;

  const label = soldOut
    ? 'Tükendi'
    : cart.busy
      ? 'Ekleniyor…'
      : atStock
        ? 'Stoktaki tüm ürünler sepette'
        : inCart > 0
          ? `Sepete Eklendi (${inCart})`
          : 'Sepete Ekle';
  const addToCart = () => void cart.add(product.variantId, 1, product.name);

  return (
    <>
      <div className="mt-5 flex items-stretch gap-2.5">
        {onRequest ? (
          <Link href="/iletisim" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark dt:h-14 dt:text-[16px]">
            <MessageSquareQuote size={19} strokeWidth={2} aria-hidden />
            Teklif İste
          </Link>
        ) : (
          <button
            type="button"
            disabled={soldOut || atStock || cart.busy}
            onClick={addToCart}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary dt:h-14 dt:text-[16px]"
          >
            <ShoppingCart size={19} strokeWidth={2} aria-hidden />
            {label}
          </button>
        )}

        <button
          type="button"
          aria-pressed={favourite}
          onClick={() => toggle('favourites', product.id)}
          aria-label={`${product.name} ürününü favorilere ekle`}
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-colors duration-(--duration-fast) ease-in-out dt:h-14 dt:w-14 ${
            favourite
              ? 'border-danger bg-danger/10 text-danger-ink'
              : 'border-line-strong text-text-secondary hover:border-danger hover:text-danger-ink'
          }`}
        >
          <Heart size={20} strokeWidth={1.8} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
        </button>
      </div>

      <button
        type="button"
        onClick={() => toggle('compare', product.id)}
        disabled={compareFull}
        aria-pressed={comparing}
        className={`mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:text-text-secondary ${
          comparing ? 'text-brand-text' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Scale size={15} strokeWidth={1.9} aria-hidden />
        {comparing
          ? 'Karşılaştırmadan çıkar'
          : compareFull
            ? `Karşılaştırma dolu (${COMPARE_LIMIT})`
            : 'Karşılaştırmaya ekle'}
      </button>

      {/* Sticky buy bar, mobile and tablet only: the desktop buy block stays in
          view on its own. `pb-safe`-style padding is not needed here because the
          bar is inside the normal document flow of a fixed element with its own
          padding. */}
      {/* The sticky buy bar floats over the page, so it takes the overlay step.
          It was separated from the content by a 1px top border alone, which on
          a white-on-white scroll left the bar and the page reading as one
          surface — the shadow is what tells you the content passes UNDER it. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-card/95 px-3 py-2.5 shadow-e3 backdrop-blur dt:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] text-text-secondary">{product.brand}</p>
            <p className={`font-extrabold leading-tight tabular-nums text-text-primary ${onRequest ? 'text-[13px]' : 'text-[16px]'}`}>
              {priceLabel(product.price)}
            </p>
          </div>
          {onRequest ? (
            <Link href="/iletisim" className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark">
              <MessageSquareQuote size={17} strokeWidth={2} aria-hidden />
              Teklif İste
            </Link>
          ) : (
            <button
              type="button"
              disabled={soldOut || atStock || cart.busy}
              onClick={addToCart}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
            >
              <ShoppingCart size={17} strokeWidth={2} aria-hidden />
              {label}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
