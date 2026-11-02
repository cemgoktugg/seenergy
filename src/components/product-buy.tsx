'use client';

/**
 * The product page's interactive block: quantity, add to cart, buy now, the
 * small favourite / compare / quote links, and the mobile sticky buy bar.
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

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, MessageCircle, Minus, MessageSquareQuote, Plus, Scale, ShoppingCart } from 'lucide-react';

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

  /* The sticky bar appears only once the buy block has left the screen, so it
     never covers it, nor doubles it. */
  const block = useRef<HTMLDivElement>(null);
  const [blockVisible, setBlockVisible] = useState(true);
  useEffect(() => {
    if (!block.current) return;
    const observer = new IntersectionObserver(([entry]) => setBlockVisible(entry.isIntersecting));
    observer.observe(block.current);
    return () => observer.disconnect();
  }, []);

  /* Rectangular on hairlines, like the page around them; a stepper's three
     cells divided by the same 1px line. */
  const button = 'flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-(--card-radius) px-3 text-[16px] font-bold transition-colors duration-(--duration-fast)';
  const primary = `${button} bg-signal text-white hover:bg-signal-dark`;
  const secondary = `${button} border border-text-primary bg-surface-card text-text-primary hover:bg-text-primary hover:text-surface-card`;

  return (
    <>
      <div ref={block} className="mt-4">
        {onRequest ? (
          <div className="flex flex-wrap items-stretch gap-2">
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
        ) : soldOut ? (
          /* Sold out: nothing to add, so the way forward is asking. */
          <div className="flex flex-wrap items-stretch gap-2">
            <button type="button" disabled className={`${button} flex-1 basis-full cursor-not-allowed bg-line-strong text-text-secondary sm:basis-0`}>
              Tükendi
            </button>
            <Link href={quoteHref(product.sku)} className={`${secondary} flex-1`}>
              Stok için bize yazın
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-stretch gap-2">
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
                  className="grid h-full w-11 place-items-center rounded-l-(--card-radius) text-text-primary transition-colors duration-(--duration-fast) hover:bg-surface-page disabled:opacity-35"
                >
                  <Minus size={16} strokeWidth={1.5} aria-hidden />
                </button>
                <output aria-live="polite" className="grid h-full w-10 place-items-center text-[16px] font-bold tabular-nums text-text-primary">
                  {qty}
                </output>
                <button
                  type="button"
                  aria-label="Adedi artır"
                  disabled={qty >= left || blocked}
                  onClick={() => setQuantity(Math.min(left, qty + 1))}
                  className="grid h-full w-11 place-items-center rounded-r-(--card-radius) text-text-primary transition-colors duration-(--duration-fast) hover:bg-surface-page disabled:opacity-35"
                >
                  <Plus size={16} strokeWidth={1.5} aria-hidden />
                </button>
              </div>

              <button
                type="button"
                disabled={blocked}
                aria-busy={cart.busy}
                onClick={() => void addToCart()}
                className={`${primary} min-w-0 flex-1 disabled:cursor-not-allowed ${
                  cart.busy ? 'disabled:bg-signal/70 disabled:text-white' : 'disabled:bg-line-strong disabled:text-text-secondary'
                }`}
              >
                {cart.busy ? (
                  <Loader2 size={19} strokeWidth={1.5} aria-hidden className="animate-spin motion-reduce:animate-none" />
                ) : (
                  <ShoppingCart size={19} strokeWidth={1.5} aria-hidden />
                )}
                {label}
                {/* The count rides as a pill, not in the label: "Sepete Ekle
                    (1 sepette)" broke onto two lines on a phone. */}
                {inCart > 0 && !atStock && !cart.busy && (
                  <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-bold tabular-nums sm:inline">
                    {inCart} sepette
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              disabled={blocked}
              onClick={() => void buyNow()}
              className={`${secondary} mt-2 h-11 w-full text-[14px] disabled:cursor-not-allowed disabled:opacity-40`}
            >
              Hemen Al
            </button>
          </>
        )}
      </div>

      {/* Compact buy bar, below `dt` only, while the block above is off screen. */}
      {blockVisible ? null : (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface-card px-3 py-2 dt:hidden">
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
              <MessageSquareQuote size={17} strokeWidth={1.5} aria-hidden />
              Teklif al
            </Link>
          ) : (
            <button
              type="button"
              disabled={blocked}
              onClick={() => void addToCart()}
              className="ml-auto flex h-11 flex-1 items-center justify-center gap-2 rounded-(--card-radius) bg-signal text-[14px] font-bold text-white hover:bg-signal-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
            >
              <ShoppingCart size={17} strokeWidth={1.5} aria-hidden />
              {soldOut ? 'Tükendi' : cart.busy ? 'Ekleniyor…' : 'Sepete Ekle'}
            </button>
          )}
        </div>
      </div>
      )}
    </>
  );
}

/**
 * The small controls under the purchase: favourite, compare, a volume quote,
 * WhatsApp (a product without a price has its big button above). Text and a thin
 * icon, 44px tall to a finger: reference, not purchase.
 */
export function ProductLinks({ product, whatsapp }: { product: Product; whatsapp?: string }) {
  const { has, toggle, count, ready } = useStore();
  const favourite = ready && has('favourites', product.id);
  const comparing = ready && has('compare', product.id);
  const compareFull = ready && !comparing && count('compare') >= COMPARE_LIMIT;
  const link =
    'inline-flex h-11 items-center gap-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-(--duration-fast) hover:text-text-primary';

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-4">
      <button
        type="button"
        aria-pressed={favourite}
        onClick={() => toggle('favourites', product.id)}
        aria-label={`${product.name} ürününü favorilere ekle`}
        className={`${link} ${favourite ? 'text-danger-ink hover:text-danger-ink' : ''}`}
      >
        <Heart size={16} strokeWidth={1.5} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
        {favourite ? 'Favorilerde' : 'Favorilere ekle'}
      </button>
      <button
        type="button"
        onClick={() => toggle('compare', product.id)}
        disabled={compareFull}
        aria-pressed={comparing}
        className={`${link} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Scale size={16} strokeWidth={1.5} aria-hidden />
        {comparing ? 'Karşılaştırmada' : compareFull ? `Karşılaştırma dolu (${COMPARE_LIMIT})` : 'Karşılaştır'}
      </button>
      {product.price != null && (
        <Link href={quoteHref(product.sku)} className={link}>
          <MessageSquareQuote size={16} strokeWidth={1.5} aria-hidden />
          Toplu alım için teklif
        </Link>
      )}
      {product.price != null && whatsapp ? (
        <a href={waHref(whatsapp, `Merhaba, ${product.sku} hakkında bilgi almak istiyorum.`)} target="_blank" rel="noopener" className={link}>
          <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
          WhatsApp’tan sor
        </a>
      ) : null}
    </div>
  );
}
