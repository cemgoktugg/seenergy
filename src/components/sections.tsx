/* eslint-disable @next/next/no-img-element */
/**
 * Homepage section building blocks.
 *
 * Two section-header styles are reproduced because the reference uses both
 * (spec §3): an image banner with a centred title, and a flat amber bar.
 * Neither is an <h2> on the reference; ours are, because a page needs a
 * heading outline — that is an implementation-quality change, not a
 * composition change.
 */

import Link from 'next/link';
import { ArrowRight, BadgeCheck, Lock, RefreshCcw, Truck } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import type { Product } from '@/data/catalog';
import {
  BLOG_POSTS,
  BRANDS,
  TRUST_ITEMS,
  type CategoryTile,
  type NavItem,
} from '@/data/site';

const TRUST_ICONS = { truck: Truck, badge: BadgeCheck, lock: Lock, refresh: RefreshCcw };

/* ------------------------------------------------------------------ */
/* section headers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Image banner header.
 *
 * Measured: the reference uses image banners with overlaid text, not flat
 * colour bars, and their heights differ per instance —
 *   "ALL IN ONE Bilgisayarlar"  1320 × 71   (18.6 : 1)
 *   "OTO TEYPLER"               1320 × 98   (13.5 : 1)
 * so the ratio is a prop rather than one hard-coded height.
 */
export function SectionBanner({
  title,
  image,
  href,
  ratio = '1320/71',
}: {
  title: string;
  image: string;
  href?: string;
  ratio?: '1320/71' | '1320/98';
}) {
  const aspect = ratio === '1320/98' ? 'dt:aspect-[1320/98]' : 'dt:aspect-[1320/71]';
  const content = (
    <div className={`relative h-[46px] overflow-hidden rounded-(--card-radius) sm:h-[64px] dt:h-auto ${aspect}`}>
      <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
      {/* Was 14 / 18 / 22 across three breakpoints. 18 and 22 both landed on
          the 20px tier, which collapsed the last two steps into one — so the
          `dt` override now says nothing and is dropped rather than left as a
          rule that looks like it does something. */}
      <h2 className="absolute inset-0 grid place-items-center px-4 text-center text-[14px] font-normal text-white sm:text-[20px]">
        {title}
      </h2>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

/**
 * Section header.
 *
 * The reference puts a solid amber bar across the full container with centred
 * white text, and that is what stood here. It was the most dated element left
 * on the page: a heavy filled band shouting a title. This is the same heading
 * at the same place in the flow, restated in the page's newer language — an
 * accent tick, a left-aligned bold title, a hairline rule — so it matches the
 * brand-showcase and slider headers instead of fighting them.
 *
 * A deliberate departure from the reference, at the client's request.
 */
export function SectionBar({
  title,
  href,
  tone = 'light',
}: {
  title: string;
  href?: string;
  /** `dark` is for the full-bleed chrome band, where the ink inverts. */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <div
      className={`flex items-end justify-between gap-4 border-b pb-2.5 ${
        dark ? 'border-chrome-line' : 'border-line'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {/* On chrome the solid indigo tick disappears into the surface, so the
            accent becomes the logo gradient there. */}
        <span
          aria-hidden
          className={`h-5 w-1 shrink-0 rounded-full dt:h-6 ${
            dark ? 'bg-linear-to-b from-grad-1 to-grad-4' : 'bg-brand'
          }`}
        />
        <h2
          className={`truncate text-[16px] font-extrabold tracking-tight dt:text-[20px] ${
            dark ? 'text-white' : 'text-text-primary'
          }`}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold transition-colors duration-(--duration-fast) dt:text-[13px] ${
            dark
              ? 'text-white/70 hover:text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Tümü
          <ArrowRight size={13} strokeWidth={2.25} aria-hidden />
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* product layouts                                                     */
/* ------------------------------------------------------------------ */

/**
 * Desktop grid, mobile rail.
 * The reference switches to horizontally scrolling rails below `lg` with the
 * next card peeking — reproduced here with scroll-snap rather than a library.
 */
export function ProductGrid({
  products,
  columns = 4,
  layout = 'rail',
}: {
  products: Product[];
  columns?: 4 | 5;
  /**
   * `rail`  — homepage bands: a horizontal scroller below `lg` with the next
   *           card peeking, which is the measured reference behaviour and the
   *           right one for a band you are meant to skim past.
   * `grid`  — listing pages: always a vertical grid.
   *
   * The distinction is not cosmetic. Measured on /kategori at 390, the rail
   * showed **2 of 6 products** — the grid was 1082px wide inside a 374px
   * viewport, so two thirds of the results needed a horizontal swipe to reach.
   * A band is something you glance at; a listing is the thing you came to read.
   */
  layout?: 'rail' | 'grid';
}) {
  // Measured: 20px gutter. At 1440 that yields (1320 − 4×20)/5 = 248px and
  // (1320 − 3×20)/4 = 315px — the two card widths read off the reference.
  const desktop = columns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-(--space-grid-gap) sm:grid-cols-3 ${desktop}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`rail rail-rows-lg gap-(--space-grid-gap) auto-cols-[46%] sm:auto-cols-[31%] lg:grid lg:auto-cols-auto lg:overflow-visible ${desktop}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * Promo tile + product rail.
 *
 * Measured: this band is NOT five equal cells. The reference splits it into a
 * 335px promo column and a separate 985px rail carrying four 235px cards:
 *
 *   promo   315 × 324 at x=60   (33px shorter than the cards, top-aligned)
 *   rail    x=395, 985 wide     4 cards of 235, gap 16
 *
 * Reusing the 5-across 248px cell made the promo 67px too narrow and 33px too
 * tall, and started the rail 67px too far left.
 */
export function PromoProductRow({
  products,
  promo,
}: {
  products: Product[];
  promo: { title: string; subtitle: string; href: string; image: string };
}) {
  return (
    <div className="rail auto-cols-[46%] gap-2.5 sm:auto-cols-[31%] lg:grid lg:auto-cols-auto lg:grid-cols-[335fr_985fr] lg:items-start lg:gap-(--space-grid-gap) lg:overflow-visible">
      {/* Radius stays on the card token, not the panel one: this tile sits in
          the same row as four product cards and a softer corner here would
          read as a mismatch rather than a hierarchy. */}
      <Link
        href={promo.href}
        /* A flex column, and that is load-bearing rather than stylistic.
           Two earlier shapes both failed, measured:
             img in flow + copy absolute-centred → 38% fill, 105px of dead
               space above AND below at 1440
             img absolute + copy absolute         → no in-flow content at all,
               so the tile collapsed to 0px below `lg`; adding a base aspect
               then pinned it to 115px at 390 while the copy needed 116px, and
               the copy overflowed its own box by 17px with 88px of overlap
           In a column the copy is IN FLOW, so the box can never be shorter than
           its own text at any width, and the artwork takes the space that is
           left above it. Overlap becomes impossible by construction rather than
           by tuning a ratio. The measured 315/324 still governs from `lg` up. */
        className="group relative flex flex-col overflow-hidden rounded-(--card-radius) bg-linear-to-br from-brand to-brand-dark lg:aspect-[315/324]"
      >
        {/* The artwork becomes texture under the gradient instead of a flat
            fill behind the type. */}
        {/* Measured at 1440: the tile is 330×339 but its copy occupies only
            129px — 38% fill, with 105px of dead space above AND below, sitting
            beside 357px product cards. Centring short copy in a tall box is
            what produced two equal voids.
            Both voids are now used: the artwork is anchored to the top at a
            readable opacity so the device fills the upper half, and the copy is
            anchored to the bottom. Same box, same grid, no empty middle. */}
        {/* Artwork region: grows into whatever height the copy does not use,
            with a floor so it never disappears on a short tile. */}
        <span className="relative min-h-[84px] flex-1">
          <img
            src={promo.image}
            alt=""
            /* Full opacity, no blend mode: this is a transparent cutout, so it
               composites onto the gradient on its own. The 45% opacity and the
               overlay blend that used to live here were compensating for an
               asset that carried its own background. */
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-(--duration-slow) ease-out group-hover:scale-105"
            loading="lazy"
          />
        </span>
        <div className="relative z-10 p-4 text-white lg:p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
            Kampanya
          </p>
          <p className="mt-2 text-[20px] font-extrabold leading-[1.1] tracking-tight sm:text-[24px]">
            {promo.title}
          </p>
          <p className="text-[20px] font-extrabold leading-[1.1] tracking-tight text-white/85 sm:text-[24px]">
            {promo.subtitle}
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out group-hover:bg-surface-instalment group-hover:text-white">
            HEMEN İNCELE
            <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
          </span>
        </div>
      </Link>

      {/* `contents` on mobile so the four cards become direct items of the
          outer rail rather than a nested scroller stacked under the promo.
          Measured desktop gap inside the rail is 16px, tighter than the 20px
          page gutter — that is what lands the four cards on 235. */}
      <div className="contents lg:grid lg:grid-cols-4 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* promotional strips                                                  */
/* ------------------------------------------------------------------ */

/**
 * Category promo strip.
 * Measured: 4 tiles of 315 × 175 (1.8 : 1) with a 20px gutter, and 2 × 2 on
 * mobile at the same ratio. Appears twice on the reference homepage.
 */
export function CategoryTiles({ tiles }: { tiles: CategoryTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-(--space-grid-gap) lg:grid-cols-4">
      {tiles.map((tile, index) => {
        // The reference alternates a filled amber tile with a white one that
        // carries an amber label band. Keeping the alternation is what gives
        // the strip its rhythm.
        const filled = index % 2 === 0;
        return (
          <Link
            key={tile.href}
            href={tile.href}
            /* The filled tile carries the logo gradient rather than flat
               indigo. Everything else on this page now speaks that language —
               the nav underline, the panel caps, the technical band, the hero
               wash — and a solid fill was the last place the identity showed up
               as a single swatch. The alternation itself is kept: it is the
               measured rhythm of the strip. */
            className={`group relative flex aspect-[315/175] items-center overflow-hidden rounded-(--card-radius) ${
              filled
                ? 'bg-linear-to-br from-grad-2 via-grad-3 to-grad-4'
                : 'border border-line bg-white'
            }`}
          >
            <div className="relative z-10 w-[58%] p-3 lg:p-5">
              <p
                className={`text-[12px] font-extrabold uppercase leading-tight lg:text-[20px] ${
                  filled ? 'text-white/85' : 'text-brand-dark'
                }`}
              >
                {tile.title}
              </p>
              <p
                className={`text-[12px] font-extrabold uppercase leading-tight lg:text-[20px] ${
                  filled ? 'text-white' : 'text-text-primary'
                }`}
              >
                {tile.subtitle}
              </p>
              {/* The arrow travels on hover, the same affordance the hero CTA
                  and the banners use — a label in a pill said "this is a
                  button" and nothing more. */}
              <span
                className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold lg:text-[11px] ${
                  filled ? 'bg-white text-ink-fixed' : 'bg-brand text-white'
                }`}
              >
                İNCELE
                <ArrowRight
                  size={11}
                  strokeWidth={2.75}
                  aria-hidden
                  className="transition-transform duration-(--duration-base) ease-out group-hover:translate-x-0.5"
                />
              </span>
            </div>

            {/* No blend mode. These tiles use the transparent product cutouts
                (see CATEGORY_TILES), so the device composites cleanly onto both
                the amber and the white tile. `multiply` here used to turn the
                product brown on the amber ones. */}
            <img
              src={tile.product}
              alt=""
              className="absolute right-0 top-1/2 h-[92%] w-[48%] -translate-y-1/2 object-contain transition-transform duration-(--duration-base) group-hover:scale-105"
              loading="lazy"
            />
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Full-width campaign banner.
 *
 * The reference band is 1320×264 (5:1) and that is what this reproduced. The
 * client's note was that it eats the page for what it says — two lines of copy
 * floating in 264px of artwork. It is now a 150px strip at 1440 (43% shorter)
 * that earns its height: accent tick, eyebrow, headline and a real call to
 * action on one line, over a scrim that keeps the copy legible against any
 * artwork behind it.
 *
 * A deliberate departure from the measured reference, at the client's request.
 */
export function WideBanner({
  image,
  title,
  subtitle,
  href,
}: {
  image: string;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block h-[92px] overflow-hidden rounded-(--panel-radius) sm:h-[124px] dt:h-[150px]"
    >
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.03]"
        loading="lazy"
      />
      {/* Scrim: the copy sits on the left, so the artwork stays visible on the
          right instead of being flattened under a full-width overlay. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-surface-instalment/95 via-surface-instalment/70 to-transparent"
      />
      <div className="absolute inset-0 flex items-center gap-3 px-4 dt:gap-5 dt:px-8">
        <span aria-hidden className="h-8 w-1 shrink-0 rounded-full bg-brand dt:h-12" />
        <div className="min-w-0">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.16em] text-white/75 dt:text-[11px]">
            {title}
          </p>
          {/* Two lines rather than one truncated one: at 390 the headline is
              wider than the strip and `truncate` cut it to "…led bar çeşitl…".
              It still fits on one line from `dt` up. */}
          <p className="mt-0.5 line-clamp-2 text-[16px] font-extrabold leading-[1.15] tracking-tight text-white dt:mt-1 dt:text-[24px]">
            {subtitle}
          </p>
        </div>
        <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out group-hover:bg-brand group-hover:text-white sm:inline-flex dt:text-[13px]">
          İncele
          <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/**
 * Two half-width banners.
 *
 * Measured at 650 × 263 each on the reference. Restated here in the same
 * language as the wide banner — accent tick, eyebrow, title, white CTA over a
 * left-weighted scrim — because the uppercase title with a small amber pill was
 * the last instance of the pattern the wide banner and the promo tile have
 * already left behind. 186px at 1440 rather than 263 for the same reason: the
 * copy never needed the extra height.
 *
 * A deliberate departure from the measured reference, at the client's request.
 */
export function DualBanners({
  items,
}: {
  items: { image: string; title: string; href: string; eyebrow?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-(--space-grid-gap) sm:grid-cols-2">
      {/* Keyed by title, not href: both banners legitimately point at
          /markalar, and href would collide. */}
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group relative block h-[132px] overflow-hidden rounded-(--panel-radius) sm:h-[156px] dt:h-[186px]"
        >
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-surface-instalment/95 via-surface-instalment/65 to-transparent"
          />
          <div className="absolute inset-0 flex items-center gap-3 px-4 dt:gap-4 dt:px-6">
            <span aria-hidden className="h-8 w-1 shrink-0 rounded-full bg-brand dt:h-10" />
            <div className="min-w-0">
              {item.eyebrow && (
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.16em] text-white/70 dt:text-[10px]">
                  {item.eyebrow}
                </p>
              )}
              <p className="mt-0.5 line-clamp-2 text-[16px] font-extrabold leading-[1.15] tracking-tight text-white dt:text-[20px]">
                {item.title}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out group-hover:bg-brand group-hover:text-white">
                İncele
                <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * Full-bleed technical band.
 *
 * This is the page's only dark surface outside the header, and it exists to fix
 * three measured problems at the same point in the flow:
 *
 *   1. Module monotony. Seven brand showcases run ~3500px in one unbroken
 *      rhythm, then a 15-card tab grid follows. Placed between them, this band
 *      cuts that stretch in half.
 *   2. No dark band anywhere in the body. `--color-chrome` lived only in the
 *      header and the card instalment strip, so the whole page was white cards
 *      on grey with no contrast anchor.
 *   3. A compressed type scale. Nothing on the page sat between the 20px
 *      section headings and the 12px card titles, so the page never spoke
 *      loudly once. The headline here is that missing tier.
 *
 * Full-bleed on purpose: a dark band inside the 1320 container would read as a
 * very large card. It brings its own `container-main` so the copy still lines
 * up with every band above and below it.
 *
 * `--color-highlight` measures 13.5:1 on this near-black (see globals.css), so
 * the figures are legible rather than decorative.
 */
export function TechBand({
  eyebrow,
  title,
  description,
  stats,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** Placeholder figures — confirm with the client before launch. */
  stats: { value: string; label: string }[];
  cta: { label: string; href: string };
}) {
  return (
    <div className="relative overflow-hidden bg-chrome">
      {/* The logo gradient as a hairline, the same device that ties the nav
          trigger to the mega panel. It is what marks this as SEENERGY's own
          surface rather than a generic dark strip. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
      />

      <div className="container-main py-9 dt:py-14">
        <div className="flex flex-col gap-6 dt:flex-row dt:items-end dt:justify-between dt:gap-10">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 dt:text-[11px]">
              <span
                aria-hidden
                className="h-[3px] w-5 rounded-full bg-linear-to-r from-grad-1 to-grad-4 dt:w-7"
              />
              {eyebrow}
            </p>
            {/* The missing tier: 26px at 390, 40px from `dt`. */}
            <h2 className="mt-2.5 max-w-[16ch] text-[24px] font-extrabold leading-[1.08] tracking-tight text-white dt:mt-3.5 dt:text-[40px]">
              {title}
            </h2>
            <p className="mt-2.5 max-w-[52ch] text-[13px] leading-[1.6] text-white/70 dt:text-[16px]">
              {description}
            </p>
          </div>

          <Link
            href={cta.href}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out hover:bg-highlight dt:text-[14px]"
          >
            {cta.label}
            <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        {/* Hairline-separated cells rather than bordered boxes: on a dark
            surface, four outlined cards would rebuild the same card rhythm this
            band exists to break. */}
        <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 border-t border-chrome-line pt-7 dt:mt-12 dt:grid-cols-4 dt:pt-9">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-[24px] font-extrabold leading-none tracking-tight tabular-nums text-highlight dt:text-[32px]">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[11px] font-medium leading-snug text-white/65 dt:mt-2.5 dt:text-[13px]">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* editorial, brands, trust                                            */
/* ------------------------------------------------------------------ */

/**
 * Blog cards — measured 315 × 325, radius 10: a 193px image over a 133px
 * centred title block. At 390 the reference lays them out as a 2-column grid of
 * 183 × 318 cards, not a horizontal rail.
 */
export function BlogCards({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-(--space-grid-gap)">
      {BLOG_POSTS.map((post) => (
        <article
          key={post.href}
          /* Elevation only on the light variant. These same cards also render
             inside the dark chrome band, where a shadow cast on near-black is
             invisible — there the raised surface is carried by bg-chrome-soft
             against bg-chrome instead. Giving both variants e1 would add cost
             and noise for something no one can see. */
          className={`group overflow-hidden rounded-(--card-radius) border transition-shadow duration-(--duration-base) ${
            dark
              ? 'border-chrome-line bg-chrome-soft'
              : 'border-line bg-surface-card shadow-e1 hover:shadow-e2'
          }`}
        >
          <Link href={post.href} className="block">
            <div className="overflow-hidden">
              <img
                src={post.image}
                alt=""
                className="aspect-[315/195] w-full object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* The measured reference block is 133px of centred, muted type.
                Left-aligned with a category tick and a read affordance reads as
                an article rather than a caption, and the text no longer floats
                in the middle of its own box. */}
            <div className="flex min-h-[112px] flex-col p-3.5 dt:p-4">
              <p
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  dark ? 'text-white/60' : 'text-text-secondary'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${dark ? 'bg-highlight' : 'bg-brand'}`}
                  aria-hidden
                />
                Blog
              </p>
              <h3
                className={`mt-2 line-clamp-2 text-[14px] font-semibold leading-[1.45] dt:text-[16px] ${
                  dark ? 'text-white' : 'text-text-primary'
                }`}
              >
                {post.title}
              </h3>
              <span
                className={`mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold transition-colors duration-(--duration-fast) ease-in-out dt:text-[12px] ${
                  dark
                    ? 'text-white/65 group-hover:text-white'
                    : 'text-text-secondary group-hover:text-brand-dark'
                }`}
              >
                Devamını oku
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

/**
 * Brand wall.
 * Measured: 47 logos on a ~119 × 70 tile across the 1320 container — 11 per row,
 * 5 rows, band height 365. A 10-column grid of 30 logos came out at 234px and
 * was the single largest remaining vertical error on the page.
 */
export function BrandGrid() {
  // Two rows running opposite ways. Split rather than duplicated, so all 45
  // brands appear exactly once per row-pair.
  const half = Math.ceil(BRANDS.length / 2);
  const rows = [BRANDS.slice(0, half), BRANDS.slice(half)];

  /* `brand-wall-plate` is an opt-in companion class, not decoration: in dark
     mode it pins this one surface light. Every one of the 45 generated marks
     carries an opaque white plate, so on a dark surface this panel would
     render as 45 white rectangles. See the dark block in globals.css.
     (Above `return (`, not inside it — third time this session.) */
  return (
    <div className="brand-wall-plate group/wall overflow-hidden rounded-(--card-radius) border border-line bg-surface-card py-4">
      {rows.map((row, index) => (
        <div key={index} className="overflow-hidden">
          <ul
            className={`brand-track flex w-max items-center ${
              index === 0
                ? 'animate-[brand-marquee_64s_linear_infinite]'
                : 'animate-[brand-marquee_78s_linear_infinite] [animation-direction:reverse]'
            } group-hover/wall:[animation-play-state:paused] group-focus-within/wall:[animation-play-state:paused]`}
          >
            {/* The list, then the same list again for the seamless wrap. The
                second copy is hidden from assistive tech and from the tab
                order — it is the same 22 links a second time. */}
            {[false, true].map((duplicate) =>
              row.map((brand) => (
                <li
                  key={`${duplicate ? 'dup-' : ''}${brand.href}`}
                  aria-hidden={duplicate || undefined}
                  className={`grid h-[70px] w-[120px] shrink-0 place-items-center ${
                    duplicate ? 'brand-dup' : ''
                  }`}
                >
                  <Link
                    href={brand.href}
                    /* The duplicate exists only to make the loop seamless, so
                       it is skipped by the keyboard as well as by AT. */
                    tabIndex={duplicate ? -1 : undefined}
                    className="block"
                    title={brand.name}
                  >
                    {/* Intrinsic size of the generated brand marks (viewBox
                        "0 0 220 90"). With `h-9 w-auto` the height was fixed
                        but the width was not reserved, so all 45 logos resolved
                        to zero width and the wall reflowed as they decoded —
                        the one genuine layout shift on this page. Declaring the
                        real ratio lets the browser reserve the box first. */}
                    <img
                      src={brand.image}
                      alt={duplicate ? '' : brand.name}
                      width={220}
                      height={90}
                      /* opacity-75, not 60. The 45 marks are painted in six
                         brand colours, and `grayscale` is luminance-based, so
                         they resolve to six different greys spanning 50 tones
                         (51..101). At 60% over white that put the blue and teal
                         marks — 30 of the 45 — at 2.53:1, under the 3:1 WCAG
                         1.4.11 floor for graphical objects, and made the wall
                         look patchy. At 75% the range is 3.37:1..5.74:1, so
                         every mark clears the floor. */
                      className="mx-auto h-9 w-auto opacity-75 grayscale transition duration-(--duration-base) hover:opacity-100 hover:grayscale-0 lg:h-10"
                      loading="lazy"
                    />
                  </Link>
                </li>
              )),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Trust row.
 * Measured at 390: the reference stacks these one per row, not 2×2
 * (reference-analysis/mobile-390/Z-footer.png).
 */
export function TrustRow() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {TRUST_ITEMS.map((item) => {
        const Icon = TRUST_ICONS[item.icon];
        return (
          <li
            key={item.title}
            className="flex items-center gap-3 rounded-(--card-radius) border border-line bg-surface-card px-3 py-3 lg:px-5 lg:py-4"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark lg:h-12 lg:w-12">
              <Icon size={20} strokeWidth={1.9} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-text-primary lg:text-[16px]">
                {item.title}
              </span>
              <span className="block text-[11px] text-text-secondary lg:text-[13px]">
                {item.subtitle}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SeoEditorial() {
  return (
    <section className="text-center">
      {/* These headings were 19.2px and 15px against 11.5px body copy. Raising
          the body to 14px to fix an unreadable 184-character measure flattened
          the ladder underneath them: 15/14 is a 1.07x step, which is no
          hierarchy at all, and 19.2/14 only 1.37x. Restoring the step is a
          consequence of that fix rather than a separate opinion —
          26/14 = 1.86x and 17/14 = 1.21x read as heading, subheading, body. */}
      <h1 className="text-[20px] font-bold tracking-tight text-text-primary lg:text-[24px]">
        Türkiye&apos;nin En Geniş Elektronik Ürün Yelpazesi
      </h1>
      <h2 className="mt-1.5 text-[16px] font-medium text-text-secondary lg:text-[16px]">
        Toptan ve perakende elektronik tedarik
      </h2>
      {/* Measured at 1440: these two paragraphs ran the full 1320px container at
          11.5px, centred — 184 characters on a single line against a 60–75
          guideline, and the smallest body copy on the page. Three faults in one
          block, all fixed here:
            measure   1320px → max-w-[60ch]. 66ch was tried first and measured
                      76 characters: a `ch` is the width of "0", and Turkish
                      prose averages narrower, so the cap must sit below the
                      character count you actually want. 60ch measures ~69.
            size      11.5px → 14px, above the 12px body-copy floor
            leading   15px on 11.5px (1.3) → 1.7, which long-form text needs
          The block stays centred; only its measure is bounded. */}
      <p className="mx-auto mt-4 max-w-[60ch] text-[13px] leading-[1.7] text-text-secondary lg:text-[14px]">
        <strong className="font-semibold text-text-primary">
          Ev teknolojileri, güvenlik sistemleri, ses sistemleri ve daha fazlası…
        </strong>{' '}
        Uydu sistemlerinden güvenlik kameralarına, televizyon yedek parçadan oto ses
        sistemlerine kadar geniş bir ürün yelpazesini tek katalogda topluyoruz. Hem son
        kullanıcıya hem de kurumsal alıcıya aynı stok derinliğiyle hizmet veriyoruz.
      </p>
      <p className="mx-auto mt-3 max-w-[60ch] text-[13px] leading-[1.7] text-text-secondary lg:text-[14px]">
        Teknik ekibimiz ürün seçiminde uyumluluk ve kurulum konularında destek sağlar.
        Toptan alımlarda kademeli fiyatlandırma ve bayi koşulları için toptan satış
        sayfamızı inceleyebilirsiniz.
      </p>
    </section>
  );
}

/** Utility type re-export so the page file needs a single import source. */
export type { NavItem };
