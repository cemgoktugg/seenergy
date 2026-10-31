'use client';

/**
 * The product page's interactive block: quantity, add to cart, buy now,
 * favourite, the secondary quote / compare actions, and the mobile sticky
 * buy bar.
 *
 * Split out of the page so the page itself stays a server component — only the
 * controls that hold state cross into the client.
 *
 * The favourite button sits in the corner of the offer box around this block,
 * which is `relative` for it. Sales first: "Sepete Ekle" is the one primary
 * action. "Teklif İste" is a
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
import { FileText, HardDrive, Heart, Minus, MessageSquareQuote, Plus, Scale, ShoppingCart } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { priceLabel, type Product } from '@/data/catalog';

import { quoteHref, waHref } from '@/lib/contact';

export function ProductBuy({ product, whatsapp }: { product: Product; whatsapp?: string }) {
  /* The cart is Medusa's, shared through CartProvider: the header badge, the
     cards and the cart page all read the same response this button updates. */
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.quantityOf(product.variantId);
  const { has, toggle, ready } = useStore();
  const favourite = ready && has('favourites', product.id);
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

  /* Rectangular on hairlines, like the page around them; a stepper's three
     cells divided by the same 1px line. */
  const button = 'flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-(--card-radius) text-[16px] font-bold transition-colors duration-(--duration-fast)';
  const primary = `${button} bg-signal text-white hover:bg-signal-dark`;
  const secondary = `${button} border border-text-primary bg-surface-card text-text-primary hover:bg-text-primary hover:text-surface-card`;

  return (
    <>
      <button
        type="button"
        aria-pressed={favourite}
        onClick={() => toggle('favourites', product.id)}
        aria-label={`${product.name} ürününü favorilere ekle`}
        className={`absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full transition-colors duration-(--duration-fast) dt:right-3 dt:top-3 ${
          favourite ? 'text-danger-ink' : 'text-text-secondary hover:text-danger-ink'
        }`}
      >
        <Heart size={24} strokeWidth={1.5} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
      </button>

      {onRequest ? (
        <div className="mt-4 flex flex-wrap items-stretch gap-2.5">
          <Link href={quoteHref(product.sku)} className={`${primary} flex-1 basis-full sm:basis-0`}>
            Teklif al
          </Link>
          {whatsapp ? (
            <a
              href={waHref(whatsapp, `Merhaba, ${product.sku} için fiyat almak istiyorum.`)}
              target="_blank"
              rel="noopener"
              className={`${secondary} flex-1`}
            >
              WhatsApp’tan sor
            </a>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-stretch gap-2.5">
          {/* Quantity. Capped at the stock still free of this cart. */}
          <div
            role="group"
            aria-label="Adet"
            className="flex h-13 shrink-0 items-center divide-x divide-line-strong rounded-(--card-radius) border border-line-strong bg-surface-card"
          >
            <button
              type="button"
              aria-label="Adedi azalt"
              disabled={qty <= 1 || blocked}
              onClick={() => setQuantity(Math.max(1, qty - 1))}
              className="grid h-full w-11 place-items-center text-text-primary transition-colors hover:bg-surface-page disabled:opacity-35"
            >
              <Minus size={16} strokeWidth={1.75} aria-hidden />
            </button>
            <output aria-live="polite" className="grid h-full w-11 place-items-center text-[16px] font-bold tabular-nums text-text-primary">
              {qty}
            </output>
            <button
              type="button"
              aria-label="Adedi artır"
              disabled={qty >= left || blocked}
              onClick={() => setQuantity(Math.min(left, qty + 1))}
              className="grid h-full w-11 place-items-center text-text-primary transition-colors hover:bg-surface-page disabled:opacity-35"
            >
              <Plus size={16} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <button
            type="button"
            disabled={blocked}
            onClick={() => void addToCart()}
            className={`${primary} min-w-[170px] flex-[1.3] disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary`}
          >
            <ShoppingCart size={19} strokeWidth={1.75} aria-hidden />
            {label}
            {/* The count rides as a pill, not in the label: "Sepete Ekle
                (1 sepette)" broke onto two lines on a phone. */}
            {inCart > 0 && !atStock && !cart.busy && (
              <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-bold tabular-nums sm:inline">
                {inCart} sepette
              </span>
            )}
          </button>

          <button
            type="button"
            disabled={blocked}
            onClick={() => void buyNow()}
            className={`${secondary} min-w-[130px] flex-1 basis-full disabled:cursor-not-allowed disabled:opacity-40 sm:basis-0`}
          >
            Hemen Al
          </button>
        </div>
      )}

      {/* Sticky buy bar, below `dt` only: the desktop buy card stays in view on
          its own. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface-card px-3 py-2.5 dt:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-text-secondary">{product.sku || product.brand}</p>
            <p
              className={`font-extrabold leading-tight tabular-nums text-text-primary ${onRequest ? 'text-[13px]' : 'text-[16px]'}`}
            >
              {onRequest ? 'Fiyat teklifle' : priceLabel(product.price)}
            </p>
          </div>
          {onRequest ? (
            <Link
              href={quoteHref(product.sku)}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-(--card-radius) bg-signal text-[14px] font-bold text-white hover:bg-signal-dark"
            >
              <MessageSquareQuote size={17} strokeWidth={2} aria-hidden />
              Teklif al
            </Link>
          ) : (
            <button
              type="button"
              disabled={blocked}
              onClick={() => void addToCart()}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-(--card-radius) bg-signal text-[14px] font-bold text-white hover:bg-signal-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
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

/**
 * The line of plain links under the offer box: the datasheet, compare, and the
 * next thing a buyer of this product needs (recorders for a camera). Text
 * links, not a third row of pill buttons — they are reference, not purchase.
 */
export function ProductLinks({
  product,
  datasheet,
  related,
}: {
  product: Product;
  datasheet: string | null;
  related?: { label: string; href: string } | null;
}) {
  const { has, toggle, count, ready } = useStore();
  const comparing = ready && has('compare', product.id);
  const compareFull = ready && !comparing && count('compare') >= COMPARE_LIMIT;
  const link =
    'inline-flex h-11 items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-(--duration-fast) hover:text-text-primary dt:h-9';

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-5">
      {datasheet && (
        <a href={datasheet} target="_blank" rel="noopener" className={link}>
          <FileText size={16} strokeWidth={1.5} aria-hidden />
          Teknik föy (PDF)
        </a>
      )}
      <button
        type="button"
        onClick={() => toggle('compare', product.id)}
        disabled={compareFull}
        aria-pressed={comparing}
        className={`${link} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Scale size={16} strokeWidth={1.5} aria-hidden />
        {comparing ? 'Karşılaştırmada' : compareFull ? `Karşılaştırma dolu (${COMPARE_LIMIT})` : 'Karşılaştırmaya ekle'}
      </button>
      {product.price != null && (
        <Link href={quoteHref(product.sku)} className={link}>
          <MessageSquareQuote size={16} strokeWidth={1.5} aria-hidden />
          Toplu alım için teklif
        </Link>
      )}
      {related && (
        <Link href={related.href} className={link}>
          <HardDrive size={16} strokeWidth={1.5} aria-hidden />
          {related.label}
        </Link>
      )}
    </div>
  );
}
