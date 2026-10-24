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

import type { CSSProperties } from 'react';
import Link from 'next/link';

import { quoteHref } from '@/lib/contact';
import { Check, Heart, MessageSquareQuote, Scale, ShoppingCart } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { discountPercent, formatPrice, PRICE_ON_REQUEST, priceLabel, type Product } from '@/data/catalog';
import { imageProps } from '@/lib/image';

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

/**
 * `featured` (the homepage's "Keşfet · Öne Çıkanlar" grid, 2026-10-24): a
 * taller picture stage, the transparent cutout instead of the plated file —
 * the product clearly larger, clear of the favourite / compare buttons —
 * on a soft spotlight, the picture floating gently (`.featured-float`, out of
 * step per card via `index`), and on hover a lift and a metallic shine across
 * the stage. Listing pages keep the plain card.
 */
export function ProductCard({
  product,
  compact = false,
  featured = false,
  index = 0,
}: {
  product: Product;
  compact?: boolean;
  featured?: boolean;
  index?: number;
}) {
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
  /* Featured stages carry a soft spotlight, on which the mock catalogue's
     plated files show their white plate as a box; their transparent cutouts
     (same names under cutout/, as the product page uses) do not. Uploaded
     photos pass through. */
  const image =
    featured && product.image.startsWith('/mock/products/')
      ? product.image.replace('/mock/products/', '/mock/products/cutout/')
      : product.image;

  return (
    <article
      style={featured ? ({ '--i': index } as CSSProperties) : undefined}
      className={`group relative flex h-full flex-col overflow-hidden border bg-surface-card transition-[box-shadow,border-color] duration-(--duration-base) ${
      compact
        ? 'rounded-(--card-radius) border-line-strong/60 hover:border-line-strong hover:shadow-e1'
        : featured
          ? 'rounded-(--card-radius) border-line shadow-e1 transition-[box-shadow,border-color,transform] hover:-translate-y-1 hover:border-line-strong hover:shadow-e3'
          : 'rounded-(--card-radius) border-line shadow-e1 hover:border-line-strong hover:shadow-e2'
    }`}>
      {/* --- image stage ------------------------------------------------ */}
      <div
        className={`relative m-2 mb-0 overflow-hidden rounded-(--card-radius) ${
          featured ? 'bg-[radial-gradient(75%_70%_at_50%_45%,#ffffff_0%,#ffffff_45%,#eef0f3_100%)]' : 'bg-white'
        }`}
      >
        <Link href={href} className="block" aria-label={product.name}>
          <div
            style={featured ? { animationDelay: `${-(index % 7) * 0.9}s` } : undefined}
            className={`flex items-center justify-center ${
              compact
                ? 'h-[112px] p-3 sm:h-[124px] dt:h-[122px]'
                : featured
                  ? 'featured-float h-[184px] px-11 py-4 sm:h-[200px] dt:h-[240px] dt:px-12 dt:py-6'
                  : 'h-[172px] p-3 sm:h-[188px] dt:h-[220px] dt:p-4'
            }`}
          >
            <img
              {...imageProps(image, featured ? 260 : 240)}
              alt={product.name}
              width={220}
              height={220}
              loading="lazy"
              className={`h-full w-full rounded-(--card-radius) object-contain transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.04] ${
                soldOut ? 'opacity-45 grayscale' : ''
              }`}
            />
          </div>
        </Link>
        {/* Featured: a metallic gloss crossing the stage on hover. */}
        {featured && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0 transition-[transform,opacity] duration-[900ms] ease-out group-hover:translate-x-[450%] group-hover:opacity-100 motion-reduce:hidden"
          />
        )}

        {badge && (
          <span
            className={`pointer-events-none absolute left-2 top-2 rounded-full px-2.5 py-1 text-[12px] font-bold leading-none tracking-[0.01em] ${badge.className}`}
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
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-ink-fixed/85 px-2.5 py-1 text-[12px] font-bold leading-none text-white">
            Tükendi
          </span>
        ) : lowStock ? (
          <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold leading-none text-warning ring-1 ring-black/5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
            Son {product.stock} ürün
          </span>
        ) : null}
      </div>

      {/* --- detail ----------------------------------------------------- */}
      {/* Fixed height so that every card in a row puts its price on the same
          line, whatever the name length or whether there is a discount.
          12 + brand 14 + 4 + name 36 + 10 + old price 16 + price 26 + 12. */}
      <div className={`card-detail relative flex flex-col px-3 ${compact ? 'h-[112px] pt-2' : 'h-[130px] pt-3'}`}>
        {/* Not uppercased: under lang="tr" CSS capitalises i as İ, turning
            Tekniva into "TEKNİVA" — right for Turkish words, wrong for a
            brand's own spelling. */}
        <p className="truncate text-[12px] font-semibold leading-[14px] tracking-[0.02em] text-text-secondary">
          {product.brand}
        </p>

        <h3 className="mt-1 line-clamp-2 h-[36px] text-[13px] font-medium leading-[18px] text-text-primary">
          <Link href={href} className="transition-colors duration-(--duration-fast) hover:text-brand-text">
            {displayName(product)}
          </Link>
        </h3>

        <div className={compact ? 'mt-1.5' : 'mt-2.5'}>
          {/* One sentence for assistive tech; the visual parts are hidden from
              it so the price is heard once, complete. */}
          <p className="sr-only">
            {priceLabel(product.price)}
            {product.compareAtPrice ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}` : ''}
            {discount !== null && discount > 0 ? `, %${discount} indirim` : ''}
          </p>

          {/* Reserved even when empty, so a discounted and an undiscounted
              card keep their prices level. The discount sits here, beside the
              price it is measured from, which leaves the price row room for
              the cart button. */}
          <p aria-hidden className="flex h-4 items-center gap-1.5 text-[12px] leading-4 tabular-nums text-text-secondary">
            {product.compareAtPrice ? (
              <span className="line-through decoration-text-secondary/60">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
            {discount !== null && discount > 0 && (
              <span className="rounded-full bg-danger/10 px-1.5 py-[2px] text-[12px] font-bold leading-none text-danger-ink">
                %{discount}
              </span>
            )}
          </p>

          {/* Tabular figures: prices sit in grids four and five across, and
              proportional digits make those columns visibly ragged. */}
          <div className="flex h-9 items-center justify-between gap-2">
            {product.price == null ? (
              <>
                <p aria-hidden className="card-touch text-[13px] font-bold leading-tight text-text-primary sm:text-[14px]">
                  {PRICE_ON_REQUEST}
                </p>
                <Link
                  href={quoteHref(product.sku)}
                  aria-label={`${product.name} için teklif isteyin`}
                  className="card-quick inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[13px] font-bold text-text-primary transition-colors duration-(--duration-fast) hover:border-brand hover:bg-brand hover:text-white"
                >
                  <MessageSquareQuote size={15} strokeWidth={2} aria-hidden />
                  Teklif İste
                </Link>
              </>
            ) : (
              <>
                <p aria-hidden className="text-[16px] font-extrabold leading-none tracking-[-0.01em] tabular-nums text-text-primary sm:text-[20px] dt:text-[20px]">
                  {formatPrice(product.price)}
                </p>
                {/* Always on screen for a pointer — the hover-only overlay this
                    replaced left a shopper who never hovered without a way to
                    buy from the card. It opens into "Sepete Ekle" on hover.
                    Touch devices keep the full-width button below instead
                    (`.card-quick` / `.card-cta` in globals.css). */}
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => void cart.add(product.variantId, 1, product.name)}
                  aria-label={`${product.name} ürününü sepete ekle`}
                  className="card-quick group/add inline-flex h-9 shrink-0 items-center rounded-full bg-brand px-[9px] text-white shadow-e1 transition-colors duration-(--duration-fast) hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary disabled:shadow-none"
                >
                  {added ? <Check size={18} strokeWidth={2.5} aria-hidden /> : <ShoppingCart size={18} strokeWidth={2} aria-hidden />}
                  <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-bold transition-[max-width,margin] duration-(--duration-base) ease-(--ease-out) group-hover:ml-1.5 group-hover:mr-1 group-hover:max-w-[110px] group-focus-visible/add:ml-1.5 group-focus-visible/add:max-w-[110px]">
                    {soldOut ? 'Tükendi' : added ? 'Sepette' : 'Sepete Ekle'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- cart control, touch only ----------------------------------
            Without a pointer (`@media (hover: none)` in globals.css) the
            action is a full-width button under the price, and every card grows
            by the same amount. With a pointer it is the round button in the
            price row above, and this block is not rendered visible. */}
        <div className="card-cta">
          {/* No price: nothing to put in a cart — the action is a quote. */}
          {product.price == null ? (
            <Link
              href={quoteHref(product.sku)}
              aria-label={`${product.name} için teklif isteyin`}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-white shadow-e2 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark"
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
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-white shadow-e2 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary disabled:shadow-none"
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
