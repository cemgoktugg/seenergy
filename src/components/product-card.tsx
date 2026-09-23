/* eslint-disable @next/next/no-img-element */
/**
 * Product card — the component the reconstruction is judged on.
 *
 * Measured target (docs/MERTER_REFERENCE_BLUEPRINT.md §4), 1440 viewport:
 *
 *   card         248 × 357   bg #fff, radius 10px, 1px solid rgb(240,240,240)
 *                            NO shadow at rest
 *   image area   246 × 235   image 235 × 235
 *   instalment   246 × 27    overlays the bottom of the image, not stacked under it
 *   detail area  246 × 120
 *     brand      13px / 700   rgb(51,51,51)      y=10  (rel. to detail area)
 *     favourite  24 × 24      right-aligned, same row as the brand
 *     name       12px / 400   two lines, 40px tall
 *     price      24px / 700   rgb(79,84,86)
 *     old price  red rgb(217,83,79), struck through
 *
 * Verified absent from the reference card on both the homepage and
 * /guvenlik-sistemleri, and therefore absent here:
 *   - a persistent add-to-cart button  (`.mycartIcon` is opacity:0 until hover)
 *   - a quantity stepper               (`.urunListeAdet` is display:none in
 *                                       every state observed, hover included)
 *   - a "KDV Dahil" line
 *
 * On hover the reference fades and slides a full-width orange "Sepete Ekle"
 * bar (233 × 44) over the brand/favourite row and lifts the card with
 * `0 3px 10px rgba(0,0,0,0.16)`. Card height does not change: 357 → 357.
 * Transition `transform 0.3s, opacity 0.3s`.
 * Evidence: reference-analysis/interactions/ref-card-A-default.png / -B-hover.png
 */

'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, CreditCard } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { useStore } from '@/components/cart-store';
import { discountPercent, formatPrice, type Product } from '@/data/catalog';

function Badges({ product }: { product: Product }) {
  return (
    <>
      {/* Measured top-left, blue pill. */}
      {product.badge === 'super-firsat' && product.stock > 0 && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-info px-2.5 py-[3px] text-[11px] font-medium text-white">
          Süper Fırsat
        </span>
      )}
      {/* Measured 107 × 23 at x=139.8, y=11 — top-right, green. */}
      {product.freeShipping && product.stock > 0 && (
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-success px-2.5 py-[3px] text-[11px] font-medium text-white">
          Ücretsiz Kargo
        </span>
      )}
      {product.badge === 'yeni' && !product.freeShipping && product.stock > 0 && (
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-brand px-2.5 py-[3px] text-[11px] font-medium text-white">
          Yeni
        </span>
      )}
    </>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  /* Shared store, not local state: a favourite added from a listing used to be
     forgotten the moment you navigated, and the header badge never saw a cart
     addition made from a card. */
  const { has, toggle, ready } = useStore();
  const cart = useCart();
  const added = cart.quantityOf(product.variantId) > 0;
  const favourite = ready && has('favourites', product.id);
  // Derived, never authored, so it cannot disagree with the prices beside it.
  const discount = discountPercent(product);

  /* Rests on e1 rather than on nothing. The card is the single most repeated
     surface on this site, so it is where the absence of an elevation system
     was most visible: a grid of flat rectangles separated only by 1px borders.
     e1 → e2 on hover also turns the interaction into a lift; before, a shadow
     simply materialised under a plane.
     (Comment sits ABOVE `return (` — inside it, the JSX would hold two
     expressions and the file stops parsing.) */
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1 transition-shadow duration-(--duration-base) hover:shadow-e2">
      {/* --- media ------------------------------------------------------ */}
      <div className="relative">
        <Badges product={product} />

        <Link href={`/urun/${product.slug}`} className="block bg-white" aria-label={product.name}>
          {/* The media block is a FIXED height, not a square: measured 235px at
              1440 for every card width (233 / 246 / 313 wide all report 235
              tall) and 195px at 390. Using aspect-square instead made the
              4-across cards 437px tall against a measured 357. */}
          <div className="flex h-[195px] items-center justify-center p-3 dt:h-[235px] dt:p-4">
            <img
              src={product.image}
              alt={product.name}
              width={235}
              height={235}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {soldOut && (
          <p className="absolute inset-x-0 bottom-7 bg-black/45 py-1 text-center text-[11px] font-bold tracking-wide text-white">
            TÜKENDİ
          </p>
        )}

        {/* A CHIP, not the full-bleed bar this used to be.
            The original reproduced the reference exactly: 27px tall, spanning
            the whole 235px media block, floating 14px off the bottom edge.
            Measured on our own grid it came out 242px wide on a 244px card —
            99%. Four of those in a row land at the identical y and stop being
            four badges: they fuse into one dark rule crossing the entire page,
            and the rule repeats at the same height on every card row. On a page
            that is mostly card grids, that was the heaviest repeating mark in
            the layout.
            The information is a real selling point and stays verbatim. Only the
            geometry changes — inset and rounded, so the gaps between cards
            break the line. This is a deliberate departure from a measured
            reference detail (CLAUDE.md governs layout from the reference, but
            the client asked for a more modern page); reverting is a one-line
            swap back to `inset-x-0 bottom-[14px] h-[27px]`. */}
        {product.instalment && (
          <p className="absolute bottom-2 left-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full border border-highlight/30 bg-surface-instalment px-2.5 py-1 text-[10px] font-medium text-white">
            <CreditCard size={12} strokeWidth={1.75} className="shrink-0 text-highlight" aria-hidden />
            {/* The phrase shortens below `sm`, and the full one stays in the
                accessibility tree.
                Measured on the two-column mobile grid: the chip came out 164px
                on a 182px card (90%) at 390 and 129 on 147 (88%) at 320 — back
                to nearly full width, AND `truncate` was cutting it to
                "PEŞİN FİYATINA 3 TAKS…", hiding the one number that matters. A
                clipped selling point is worse than a short one. "3 TAKSİT"
                alone would drop the interest-free part, which is the actual
                claim, so that survives as sr-only rather than being lost. */}
            <span className="sr-only">Peşin fiyatına 3 taksit</span>
            <span aria-hidden className="truncate">
              <span className="hidden sm:inline">PEŞİN FİYATINA </span>
              <span className="font-extrabold text-highlight">3 TAKSİT</span>
            </span>
          </p>
        )}

      </div>

      {/* --- detail ----------------------------------------------------- */}
      {/* Measured 120px at EVERY viewport (233 / 246 / 313 wide on desktop and
          181 / 183 wide on mobile all report a 120px detail block), so it is a
          fixed height rather than a content-sized one. The internal ladder
          reproduces the measured offsets relative to the card top:
            brand y=246, name y=272 (40px, two lines), price y=318 (29px)
          against a detail block starting at y=236 — i.e. 10 / 36 / 82 into it. */}
      <div className="card-detail relative flex h-[120px] flex-col px-2.5 pt-[10px]">
        {/* Brand + favourite share one row; the hover cart bar covers exactly
            this row, which is why it is its own positioned element. */}
        <div className="flex h-4 items-start justify-between gap-2">
          <p className="truncate text-[13px] font-bold leading-4 text-text-primary">
            {product.brand}
          </p>
          <button
            type="button"
            aria-pressed={favourite}
            onClick={() => toggle('favourites', product.id)}
            aria-label={`${product.name} ürününü favorilere ekle`}
            /* Hit-tested at 22×22 against a 44px floor. The brand row is a
               measured 16px inside a fixed 120px detail block, so the button
               cannot grow without breaking the card — `before` extends the
               target instead, asymmetrically on purpose: 14px up into the
               image (a large, forgiving link) and only 8px down, which stops at
               the product name's top edge rather than stealing its first line.
               22 + 14 + 8 = 44 tall. Horizontally it is asymmetric for the
               same reason: the card's `overflow-hidden` cuts the extension off
               8px to the right, so a symmetric 11px each way hit-tested at 42.
               14 left + 22 + 8 right = 44 wide. */
            className={`relative z-10 -mr-0.5 -mt-1 shrink-0 rounded-full p-0.5 transition-colors before:absolute before:-bottom-2 before:-left-[14px] before:-right-2 before:-top-[14px] before:content-[''] ${
              favourite ? 'text-danger-ink' : 'text-text-secondary hover:text-danger-ink'
            }`}
          >
            <Heart size={18} strokeWidth={1.6} fill={favourite ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>

        <h3 className="mt-[10px] line-clamp-2 h-[40px] text-[12px] leading-[20px] text-text-primary">
          <Link href={`/urun/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* The struck price does not fit on a narrow card, and three attempts
            to make it fit each failed on the widest values:
              `truncate`             → "₺1.890,00 ₺…"        (meaningless)
              no truncate            → "₺14.980,00 ₺16.461," (hard clipped)
              smaller type + gutter  → still clipped at five digits
            Measured, a 2-across card at 390 leaves ~140px of content while a
            9-character primary price plus a 9-character struck price needs
            ~143–160. Shrinking the PRIMARY price to fit a SECONDARY one is
            backwards, so below `sm` the saving is stated as a percentage —
            short enough to always fit, and the same fact said differently.
            The measured struck price returns from `sm` up, where it fits.

            One sr-only sentence carries the whole meaning, because the visual
            now differs by breakpoint; the visible parts are aria-hidden so a
            screen reader hears the price once, complete, at every width. */}
        <div className="mt-[6px] flex items-baseline gap-x-1.5 sm:gap-x-2">
          <p className="sr-only">
            {formatPrice(product.price)}
            {product.compareAtPrice
              ? `, önceki fiyat ${formatPrice(product.compareAtPrice)}`
              : ''}
            {discount !== null && discount > 0 ? `, %${discount} indirim` : ''}
          </p>

          {/* Tabular figures: prices sit in grids four and five across, and
              proportional digits make those columns visibly ragged. */}
          <p
            aria-hidden
            className="text-[16px] font-bold leading-[29px] tabular-nums text-text-price sm:text-[20px] dt:text-[24px]"
          >
            {formatPrice(product.price)}
          </p>
          {product.compareAtPrice && (
            <>
              <p
                aria-hidden
                className="hidden shrink-0 whitespace-nowrap text-[13px] font-medium text-danger-ink line-through sm:block"
              >
                {formatPrice(product.compareAtPrice)}
              </p>
              {discount !== null && discount > 0 && (
                <span
                  aria-hidden
                  className="shrink-0 rounded-md bg-danger/10 px-1.5 py-[1px] text-[11px] font-bold tabular-nums text-danger-ink sm:hidden"
                >
                  %{discount}
                </span>
              )}
            </>
          )}
        </div>

        {/* --- cart control ----------------------------------------------
            One element, two behaviours, because the two contexts genuinely
            differ.

            WITH A POINTER it is an overlay revealed on hover.
            `bottom-[calc(100%+6px)]` puts it just above this block, i.e. across
            the bottom of the artwork. That position was reached by elimination
            — the previous three all stole something:
              over the name       clicking the title added to the cart;
              over the brand row  the favourite button became unreachable;
              over the price      measured 29px of a 29px price, hiding the one
                                  number a shopper is actually reading.
            Card height is untouched at 357px because it is out of flow.

            WITHOUT ONE (`@media (hover: none)`, see globals.css) hover never
            fires — measured in a touch context: opacity 0, pointer-events none,
            so the card had no route to the cart at all. There it leaves the
            overlay and joins the flow under the price, and the detail block
            grows to fit. Every card grows equally, so rows stay aligned.

            Focus-within keeps it reachable by keyboard in both. */}
        <div className="card-cta pointer-events-none absolute inset-x-0 bottom-[calc(100%+6px)] translate-y-9 px-2.5 opacity-0 transition-[opacity,transform] duration-(--duration-base) group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            disabled={soldOut}
            onClick={() => void cart.add(product.variantId)}
            aria-label={`${product.name} ürününü sepete ekle`}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-(--card-radius) bg-brand text-[14px] font-semibold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
          >
            <ShoppingCart size={17} strokeWidth={2} aria-hidden />
            {soldOut ? 'Tükendi' : added ? 'Sepete Eklendi' : 'Sepete Ekle'}
          </button>
        </div>
      </div>
    </article>
  );
}
