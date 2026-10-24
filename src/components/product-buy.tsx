'use client';

/**
 * The product page's interactive block: quantity, add to cart, buy now,
 * favourite, the secondary quote / compare actions, and the mobile sticky
 * buy bar.
 *
 * Split out of the page so the page itself stays a server component — only the
 * controls that hold state cross into the client.
 *
 * Sales first: "Sepete Ekle" is the one primary action. "Teklif İste" is a
 * secondary action under it, for project and volume buyers. A product without
 * a price cannot go into a Medusa cart (the cart has no amount to charge), so
 * there — and only there — the quote is the primary action.
 *
 * The sticky bar is the reason this storefront has no mobile bottom navigation
 * (docs/INFORMATION_ARCHITECTURE §8); that decision assumes this bar exists, so
 * it is part of the page rather than an enhancement.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Minus, MessageSquareQuote, Plus, Scale, ShoppingCart, Zap } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { priceLabel, type Product } from '@/data/catalog';

import { quoteHref } from '@/lib/contact';

export function ProductBuy({ product }: { product: Product }) {
  /* The cart is Medusa's, shared through CartProvider: the header badge, the
     cards and the cart page all read the same response this button updates. */
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.quantityOf(product.variantId);
  const { has, toggle, count, ready } = useStore();
  const favourite = ready && has('favourites', product.id);
  const comparing = ready && has('compare', product.id);
  /* The limit is enforced in the store; surfacing it here stops the control
     from looking broken when a fifth product silently refuses to be added. */
  const compareFull = ready && !comparing && count('compare') >= COMPARE_LIMIT;
  const onRequest = product.price == null;
  const soldOut = product.stock === 0;
  /* Stock is enforced by Medusa; capping the stepper at what is left saves
     the visitor a round trip to an error. */
  const left = Math.max(0, product.stock - inCart);
  const atStock = !soldOut && left === 0;
  const [quantity, setQuantity] = useState(1);
  const qty = Math.min(quantity, Math.max(1, left));

  const label = soldOut
    ? 'Tükendi'
    : cart.busy
      ? 'Ekleniyor…'
      : atStock
        ? 'Stoktaki tümü sepette'
        : 'Sepete Ekle';
  const blocked = soldOut || atStock || cart.busy;

  const addToCart = async () => {
    const ok = await cart.add(product.variantId, qty, product.name);
    if (ok) setQuantity(1);
    return ok;
  };
  const buyNow = async () => {
    if (await addToCart()) router.push('/sepet');
  };

  const favouriteButton = (visibility = '') => (
    <button
      type="button"
      aria-pressed={favourite}
      onClick={() => toggle('favourites', product.id)}
      aria-label={`${product.name} ürününü favorilere ekle`}
      className={`${visibility} h-13 w-13 shrink-0 place-items-center rounded-full border transition-colors duration-(--duration-fast) ease-in-out ${
        favourite
          ? 'border-danger bg-danger/10 text-danger-ink'
          : 'border-line-strong text-text-secondary hover:border-danger hover:text-danger-ink'
      }`}
    >
      <Heart size={20} strokeWidth={1.8} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
    </button>
  );

  const compareButton = (
    <button
      type="button"
      onClick={() => toggle('compare', product.id)}
      disabled={compareFull}
      aria-pressed={comparing}
      className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-[13px] font-semibold transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-50 ${
        comparing
          ? 'border-text-primary bg-surface-page text-text-primary'
          : 'border-line-strong text-text-primary hover:border-text-primary'
      }`}
    >
      <Scale size={16} strokeWidth={1.9} aria-hidden />
      {comparing ? 'Karşılaştırmada' : compareFull ? `Karşılaştırma dolu (${COMPARE_LIMIT})` : 'Karşılaştır'}
    </button>
  );

  return (
    <>
      {onRequest ? (
        <div className="mt-5 flex items-stretch gap-2.5">
          <Link
            href={quoteHref(product.sku)}
            className="flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white shadow-e2 transition-[transform,background-color] duration-(--duration-fast) ease-in-out hover:-translate-y-px hover:bg-brand-dark"
          >
            <MessageSquareQuote size={19} strokeWidth={2} aria-hidden />
            Fiyat Teklifi Al
          </Link>
          {favouriteButton('grid')}
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-stretch gap-2.5">
            {/* Quantity. Capped at the stock still free of this cart. */}
            <div
              role="group"
              aria-label="Adet"
              className="flex h-13 items-center rounded-full border border-line-strong bg-surface-card"
            >
              <button
                type="button"
                aria-label="Adedi azalt"
                disabled={qty <= 1 || blocked}
                onClick={() => setQuantity(Math.max(1, qty - 1))}
                className="grid h-full w-11 place-items-center rounded-l-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-35"
              >
                <Minus size={16} strokeWidth={2.25} aria-hidden />
              </button>
              <output aria-live="polite" className="w-8 text-center text-[16px] font-bold tabular-nums text-text-primary">
                {qty}
              </output>
              <button
                type="button"
                aria-label="Adedi artır"
                disabled={qty >= left || blocked}
                onClick={() => setQuantity(Math.min(left, qty + 1))}
                className="grid h-full w-11 place-items-center rounded-r-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-35"
              >
                <Plus size={16} strokeWidth={2.25} aria-hidden />
              </button>
            </div>

            <button
              type="button"
              disabled={blocked}
              onClick={() => void addToCart()}
              className="flex h-13 min-w-[180px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand text-[16px] font-bold text-white shadow-e2 transition-[transform,background-color] duration-(--duration-fast) ease-in-out hover:-translate-y-px hover:bg-brand-dark disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary disabled:shadow-none"
            >
              <ShoppingCart size={19} strokeWidth={2} aria-hidden />
              {label}
              {/* The count rides as a pill, not in the label: "Sepete Ekle
                  (1 sepette)" broke onto two lines on a phone. */}
              {inCart > 0 && !atStock && !cart.busy && (
                <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-bold tabular-nums sm:inline">
                  {inCart} sepette
                </span>
              )}
            </button>
            {/* Beside the cart button from `sm`; below it the row has no
                room for a third control, so it moves to the secondary row. */}
            {favouriteButton('hidden sm:grid')}
          </div>

          <button
            type="button"
            disabled={blocked}
            onClick={() => void buyNow()}
            className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-text-primary bg-surface-card text-[15px] font-bold text-text-primary transition-colors duration-(--duration-fast) hover:bg-text-primary hover:text-surface-card disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Zap size={17} strokeWidth={2.25} aria-hidden />
            Hemen Al
          </button>
        </>
      )}

      {/* Secondary: a quote for volume / project buyers, and compare. */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
        {!onRequest && (
          <Link
            href={quoteHref(product.sku)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong text-[13px] font-semibold text-text-primary transition-colors duration-(--duration-fast) hover:border-text-primary"
          >
            <MessageSquareQuote size={16} strokeWidth={1.9} aria-hidden />
            <span className="sm:hidden">Teklif iste</span>
            <span className="hidden sm:inline">Toplu alım için teklif iste</span>
          </Link>
        )}
        {compareButton}
        {!onRequest && favouriteButton('grid h-11! w-11! sm:hidden')}
      </div>

      {/* Sticky buy bar, below `dt` only: the desktop buy card stays in view on
          its own. It floats over the page, so it takes the overlay shadow. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-card/95 px-3 py-2.5 shadow-e3 backdrop-blur dt:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] text-text-secondary">{product.sku || product.brand}</p>
            <p
              className={`font-extrabold leading-tight tabular-nums text-text-primary ${onRequest ? 'text-[13px]' : 'text-[17px]'}`}
            >
              {priceLabel(product.price)}
            </p>
          </div>
          {onRequest ? (
            <Link
              href={quoteHref(product.sku)}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white"
            >
              <MessageSquareQuote size={17} strokeWidth={2} aria-hidden />
              Fiyat Teklifi Al
            </Link>
          ) : (
            <button
              type="button"
              disabled={blocked}
              onClick={() => void addToCart()}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
            >
              <ShoppingCart size={17} strokeWidth={2} aria-hidden />
              {soldOut ? 'Tükendi' : cart.busy ? 'Ekleniyor…' : 'Sepete Ekle'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
