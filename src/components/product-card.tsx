/* eslint-disable @next/next/no-img-element */
/**
 * Product card — the most repeated surface on the site (64 on the homepage).
 *
 * Anatomy, top to bottom:
 *
 *   image stage   inset 8px, rounded, always white — product photography is
 *                 shot on white, so the stage matches it in both themes and a
 *                 photo with its own background reads as a framed plate
 *     top-left    at most ONE merchandising chip (Süper Fırsat / Yeni / Çok Satan)
 *     top-right   favourite, a round button
 *     bottom-left real stock state only: "Son 3 ürün", or "Tükendi"
 *   brand         small muted line, in the brand's own spelling
 *   name          two lines, without the brand repeated at its start
 *   price         previous price (struck, muted) on its own line, then the
 *                 price with the discount beside it
 *
 * What left the card, and why:
 *   - "Ücretsiz Kargo" sat on 46 of 48 badged cards. A mark on nearly every
 *     card tells nobody anything; the announcement bar says it once.
 *   - "Peşin fiyatına 3 taksit" promised instalments the checkout cannot take
 *     (no card provider). See INSTALMENTS_AVAILABLE.
 *   - The two top chips (left and right) overlapped by 28–50px on the
 *     two-column mobile grid. With one chip on the left and a round button on
 *     the right, they cannot meet.
 *
 * The previous price used to be hidden below `sm` because price + struck price
 * did not fit one line on a 2-up phone card. On its own line it always fits,
 * so the card says the same thing at every width.
 *
 * Kept from the measured build: the fixed-height detail block (rows align in
 * every grid), and the add-to-cart control that overlays the bottom of the
 * stage for a pointer and joins the flow for touch (globals.css,
 * `@media (hover: none)`).
 */

'use client';

import Link from 'next/link';
import { Heart, MessageSquareQuote, Scale, ShoppingCart } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { discountPercent, formatPrice, PRICE_ON_REQUEST, priceLabel, type Product } from '@/data/catalog';

/** Below this many units the card says so. It is the real Medusa stock. */
const LOW_STOCK = 5;

const BADGES: Record<NonNullable<Product['badge']>, { label: string; className: string }> = {
  'super-firsat': { label: 'Süper Fırsat', className: 'bg-brand text-white' },
  yeni: { label: 'Yeni', className: 'bg-white/95 text-ink-fixed ring-1 ring-black/5' },
  'cok-satan': { label: 'Çok Satan', className: 'bg-ink-fixed text-white' },
};

/**
 * "Tekniva TK-27AIO 27…" under a "TEKNIVA" eyebrow says the brand twice.
 * Only a leading, whole-word match is dropped; the full name stays the link's
 * accessible name and the image's alt text.
 */
function displayName(product: Product): string {
  const brand = product.brand.trim();
  if (!brand) return product.name;
  const head = product.name.slice(0, brand.length);
  const rest = product.name.slice(brand.length);
  return head.toLocaleLowerCase('tr') === brand.toLocaleLowerCase('tr') && /^\s+\S/.test(rest)
    ? rest.trim()
    : product.name;
}

export function ProductCard({ product }: { product: Product }) {
  /* Stock speaks only for a product that can be bought now. A price-on-request
     model reports its stock in the quote, so its 0 is not "Tükendi" — that
     greyed out the client's whole CCTV range. */
  const sellable = product.price != null;
  const soldOut = sellable && product.stock <= 0;
  const lowStock = sellable && !soldOut && product.stock <= LOW_STOCK;
  /* Shared store, not local state: a favourite added from a listing used to be
     forgotten the moment you navigated, and the header badge never saw a cart
     addition made from a card. */
  const { has, toggle, ready, count } = useStore();
  const cart = useCart();
  const added = cart.quantityOf(product.variantId) > 0;
  const favourite = ready && has('favourites', product.id);
  const comparing = ready && has('compare', product.id);
  /* The store refuses a fifth product; the control says so instead of
     silently doing nothing. */
  const compareFull = ready && !comparing && count('compare') >= COMPARE_LIMIT;
  // Derived, never authored, so it cannot disagree with the prices beside it.
  const discount = discountPercent(product);
  const badge = product.badge && !soldOut ? BADGES[product.badge] : null;
  const href = `/urun/${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1 transition-[box-shadow,border-color] duration-(--duration-base) hover:border-line-strong hover:shadow-e2">
      {/* --- image stage ------------------------------------------------ */}
      <div className="relative m-2 mb-0 overflow-hidden rounded-[calc(var(--card-radius)-4px)] bg-white">
        <Link href={href} className="block" aria-label={product.name}>
          <div className="flex h-[172px] items-center justify-center p-3 sm:h-[188px] dt:h-[220px] dt:p-4">
            <img
              src={product.image}
              alt={product.name}
              width={220}
              height={220}
              loading="lazy"
              className={`h-full w-full rounded-md object-contain transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.04] ${
                soldOut ? 'opacity-45 grayscale' : ''
              }`}
            />
          </div>
        </Link>

        {badge && (
          <span
            className={`pointer-events-none absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10.5px] font-bold leading-none tracking-[0.01em] ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        <button
          type="button"
          aria-pressed={favourite}
          onClick={() => toggle('favourites', product.id)}
          aria-label={`${product.name} ürününü favorilere ekle`}
          /* 34px visual; `before` lifts the target to 44 without growing the
             circle. It stays inside the 8px stage inset, so the card's
             overflow-hidden cannot clip it. */
          className={`absolute right-2 top-2 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 shadow-e1 ring-1 ring-black/5 backdrop-blur transition-colors duration-(--duration-fast) before:absolute before:-inset-[5px] before:content-[''] ${
            favourite ? 'text-danger' : 'text-ink-fixed/70 hover:text-danger'
          }`}
        >
          <Heart size={17} strokeWidth={1.8} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
        </button>

        {/* Compare — the VoltEdge pattern: one tap here, and the floating
            compare bar rises with the product in it. */}
        <button
          type="button"
          aria-pressed={comparing}
          disabled={compareFull}
          onClick={() => toggle('compare', product.id)}
          aria-label={
            comparing
              ? `${product.name} ürününü karşılaştırmadan çıkar`
              : `${product.name} ürününü karşılaştırmaya ekle`
          }
          title={compareFull ? `En çok ${COMPARE_LIMIT} ürün karşılaştırılabilir` : comparing ? 'Karşılaştırmadan çıkar' : 'Karşılaştır'}
          className={`absolute right-2 top-[50px] grid h-[34px] w-[34px] place-items-center rounded-full shadow-e1 ring-1 ring-black/5 backdrop-blur transition-colors duration-(--duration-fast) before:absolute before:-inset-[5px] before:content-[''] disabled:cursor-not-allowed disabled:opacity-40 ${
            comparing ? 'bg-brand text-white' : 'bg-white/90 text-ink-fixed/70 hover:text-ink-fixed'
          }`}
        >
          <Scale size={16} strokeWidth={1.9} aria-hidden />
        </button>

        {soldOut ? (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-ink-fixed/85 px-2.5 py-1 text-[10.5px] font-bold leading-none text-white">
            Tükendi
          </span>
        ) : lowStock ? (
          <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold leading-none text-warning ring-1 ring-black/5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
            Son {product.stock} ürün
          </span>
        ) : null}
      </div>

      {/* --- detail ----------------------------------------------------- */}
      {/* Fixed height so that every card in a row puts its price on the same
          line, whatever the name length or whether there is a discount.
          12 + brand 14 + 4 + name 36 + 10 + old price 16 + price 26 + 12. */}
      <div className="card-detail relative flex h-[130px] flex-col px-3 pt-3">
        {/* Not uppercased: under lang="tr" CSS capitalises i as İ, turning
            Tekniva into "TEKNİVA" — right for Turkish words, wrong for a
            brand's own spelling. */}
        <p className="truncate text-[11.5px] font-semibold leading-[14px] tracking-[0.02em] text-text-secondary">
          {product.brand}
        </p>

        <h3 className="mt-1 line-clamp-2 h-[36px] text-[13px] font-medium leading-[18px] text-text-primary">
          <Link href={href} className="transition-colors duration-(--duration-fast) hover:text-brand-text">
            {displayName(product)}
          </Link>
        </h3>

        <div className="mt-2.5">
          {/* One sentence for assistive tech; the visual parts are hidden from
              it so the price is heard once, complete. */}
          <p className="sr-only">
            {priceLabel(product.price)}
            {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
            {discount !== null && discount > 0 ? `, %${discount} indirim` : ''}
          </p>

          {/* Reserved even when empty, so a discounted and an undiscounted
              card keep their prices level. */}
          <p aria-hidden className="h-4 text-[12px] leading-4 tabular-nums text-text-secondary line-through decoration-text-secondary/60">
            {product.compareAtPrice ? formatPrice(product.compareAtPrice) : ''}
          </p>

          {/* Tabular figures: prices sit in grids four and five across, and
              proportional digits make those columns visibly ragged. */}
          <div aria-hidden className="flex h-[26px] items-center gap-2">
            {product.price == null ? (
              <p className="text-[13px] font-bold leading-tight text-text-primary sm:text-[14px]">{PRICE_ON_REQUEST}</p>
            ) : (
              <p className="text-[17px] font-extrabold leading-none tracking-[-0.01em] tabular-nums text-text-primary sm:text-[19px] dt:text-[20px]">
                {formatPrice(product.price)}
              </p>
            )}
            {discount !== null && discount > 0 && (
              <span className="shrink-0 rounded-full bg-danger/10 px-1.5 py-[3px] text-[11px] font-bold leading-none tabular-nums text-danger-ink">
                %{discount}
              </span>
            )}
          </div>
        </div>

        {/* --- cart control ----------------------------------------------
            With a pointer: an overlay revealed on hover, across the bottom of
            the image stage — it covers neither the name (a click there must
            open the product) nor the price (the number being read).
            Without one (`@media (hover: none)` in globals.css) it joins the
            flow under the price, and every card grows by the same amount.
            Focus-within keeps it reachable by keyboard in both. */}
        <div className="card-cta pointer-events-none absolute inset-x-0 bottom-[calc(100%+8px)] translate-y-2 px-4 opacity-0 transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {/* No price: nothing to put in a cart — the action is a quote. */}
          {product.price == null ? (
            <Link
              href="/iletisim"
              aria-label={`${product.name} için teklif isteyin`}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand text-[13.5px] font-semibold text-white shadow-e2 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark"
            >
              <MessageSquareQuote size={16} strokeWidth={2} aria-hidden />
              Teklif İste
            </Link>
          ) : (
            <button
              type="button"
              disabled={soldOut}
              onClick={() => void cart.add(product.variantId, 1, product.name)}
              aria-label={`${product.name} ürününü sepete ekle`}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand text-[13.5px] font-semibold text-white shadow-e2 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary disabled:shadow-none"
            >
              <ShoppingCart size={16} strokeWidth={2} aria-hidden />
              {soldOut ? 'Tükendi' : added ? 'Sepete Eklendi' : 'Sepete Ekle'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
