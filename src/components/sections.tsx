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
import { ArrowRight, BadgeCheck, Headphones, Lock, RefreshCcw, Truck } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import type { Product } from '@/data/catalog';
import {
  BLOG_POSTS,
  BRANDS,
  type CategoryTile,
  type NavItem,
} from '@/data/site';
import { CampaignCard, TONE } from '@/components/campaign-card';
import type { Banner, TrustItem } from '@/lib/medusa/vitrin';

const TRUST_ICONS = { truck: Truck, badge: BadgeCheck, lock: Lock, refresh: RefreshCcw, support: Headphones };

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
 * Desktop grid, mobile rail.
 * The reference switches to horizontally scrolling rails below `lg` with the
 * next card peeking — reproduced here with scroll-snap rather than a library.
 */
export function ProductGrid({
  products,
  columns = 4,
  layout = 'rail',
  featured = false,
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
  /** The homepage's "Öne Çıkanlar" band: larger, floating pictures and a
   *  staggered entrance (see ProductCard's `featured`). */
  featured?: boolean;
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
      className={`rail rail-rows-lg gap-(--space-grid-gap) auto-cols-[46%] sm:auto-cols-[31%] lg:grid lg:auto-cols-auto lg:overflow-visible ${desktop} ${featured ? 'featured-grid' : ''}`}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} featured={featured} index={index} />
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
          <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white/80">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
            Kampanya
          </p>
          <p className="mt-2 text-[20px] font-extrabold leading-[1.1] tracking-tight sm:text-[24px]">
            {promo.title}
          </p>
          <p className="text-[20px] font-extrabold leading-[1.1] tracking-tight text-white/85 sm:text-[24px]">
            {promo.subtitle}
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 h-9 text-[12px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out group-hover:bg-surface-instalment group-hover:text-white">
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
                className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
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
 * Wide campaign banner and the dual banners — both are campaign cards now
 * (see campaign-card.tsx for the template and why the sound-wave artwork went).
 * Kept as named exports so the homepage reads as a list of bands.
 */
export function DualBanners({ items }: { items: Banner[] }) {
  return (
    <div className="grid grid-cols-1 gap-(--space-grid-gap) sm:grid-cols-2">
      {/* Keyed by position: both banners may point at the same page. */}
      {items.map((item, i) => (
        <CampaignCard key={i} size="half" {...item} />
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
  /** Optional: the shop can leave the button out in the Vitrin admin. */
  cta?: { label: string; href: string };
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
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-white/70">
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

          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 h-13 text-[13px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) ease-in-out hover:bg-highlight dt:text-[14px]"
            >
              {cta.label}
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
            </Link>
          ) : null}
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
                <span className="mt-2 block text-[12px] font-medium leading-snug text-white/65 dt:mt-2.5 dt:text-[13px]">
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
    /* One swipeable row below `lg`: two-up, the cards were 175px wide with
       three-line titles, and the 2×2 block was most of a 1,898px band. */
    <div className="rail rail-rows-lg auto-cols-[72%] gap-2.5 sm:auto-cols-[44%] lg:grid-cols-4 lg:gap-(--space-grid-gap)">
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
            {/* The product the post is about, on a brand tone — the campaign
                card's language, not a stock illustration. Cut-outs, so they
                composite onto the tone directly. */}
            <div className={`relative aspect-[315/195] overflow-hidden ${TONE[post.tone].surface}`}>
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain p-6 drop-shadow-[0_10px_18px_rgb(0_0_0/0.28)] transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-105 dt:p-8"
                loading="lazy"
              />
            </div>
            {/* The measured reference block is 133px of centred, muted type.
                Left-aligned with a category tick and a read affordance reads as
                an article rather than a caption, and the text no longer floats
                in the middle of its own box. */}
            <div className="flex min-h-[112px] flex-col p-3.5 dt:p-4">
              <p
                className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] ${
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
                className={`mt-auto inline-flex items-center gap-1 pt-3 text-[12px] font-semibold transition-colors duration-(--duration-fast) ease-in-out ${
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
 * Brand wall — the client's real brand logos (2026-10-27), each on a white
 * tile, all in one 120 × 32 box (see BRANDS in data/site.ts). Before that
 * it showed monogram chips of 45 generated placeholder names.
 * A fixed label on the left gives the count and the way to /markalar; two
 * rows run opposite ways behind it, fading in and out at the edges, paused
 * while the pointer or focus is on the wall. The chips follow the theme, so
 * the panel no longer needs `brand-wall-plate` to pin it light.
 *
 * Touch (`@media (hover: none)` in globals.css): no animation — a finger
 * cannot pause it — and the rows become swipeable instead.
 */
export function BrandGrid() {
  // Two rows running opposite ways. Split rather than duplicated, so every
  // brand appears exactly once per row-pair.
  const half = Math.ceil(BRANDS.length / 2);
  const rows = [BRANDS.slice(0, half), BRANDS.slice(half)];

  return (
    <div
      role="region"
      aria-label="Marka duvarı"
      className="group/wall relative isolate flex overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-br from-surface-card to-surface-page shadow-e1"
    >
      <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

      {/* --- the fixed label ------------------------------------------- */}
      <div className="relative z-10 hidden w-[230px] shrink-0 flex-col justify-center border-r border-line bg-surface-card/80 px-6 py-6 backdrop-blur lg:flex">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-text-secondary">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Marka ağı
        </p>
        <p className="mt-2 text-[40px] font-extrabold leading-none tracking-tight text-text-primary tabular-nums">
          {BRANDS.length}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-text-secondary">marka, tek çatı altında</p>
        <Link
          href="/markalar"
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-4 h-9 text-[13px] font-bold text-white transition-colors duration-(--duration-fast) hover:bg-brand-dark"
        >
          Tümünü gör
          <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>

      {/* --- the moving rows --------------------------------------------- */}
      <div className="min-w-0 flex-1 space-y-3 py-5">
        {rows.map((row, index) => (
          <div
            key={index}
            className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
          >
            <ul
              className={`brand-track flex w-max items-center gap-3 px-1.5 py-1 ${
                index === 0
                  ? 'animate-[brand-marquee_70s_linear_infinite]'
                  : 'animate-[brand-marquee_84s_linear_infinite] [animation-direction:reverse]'
              } group-hover/wall:[animation-play-state:paused] group-focus-within/wall:[animation-play-state:paused]`}
            >
              {/* The list, then the same list again for the seamless wrap. The
                  second copy is hidden from assistive tech and from the tab
                  order — the same links a second time. */}
              {[false, true].map((duplicate) =>
                row.map((brand) => (
                  <li
                    key={`${duplicate ? 'dup-' : ''}${brand.href}`}
                    aria-hidden={duplicate || undefined}
                    className={`shrink-0 ${duplicate ? 'brand-dup' : ''}`}
                  >
                    {/* White in both themes: the logos are drawn for a white
                        ground and several carry dark ink. */}
                    <Link
                      href={brand.href}
                      tabIndex={duplicate ? -1 : undefined}
                      aria-label={brand.name}
                      title={brand.name}
                      className="flex h-[51px] w-[147px] items-center justify-center rounded-(--card-radius) border border-line bg-white px-3 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2"
                    >
                      {/* One box for every logo: 120 × 32 (150 × 40 until
                          2026-10-27, 20% smaller at the client's request), each
                          as large as it fits inside it. Not lazy: on a moving track the
                          browser noticed some tiles too late and left them
                          blank; all 33 logos together are ~316 KB. */}
                      <img
                        src={brand.image}
                        alt=""
                        width={120}
                        height={32}
                        decoding="async"
                        className="h-8 w-[120px] object-contain"
                      />
                    </Link>
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Trust row.
 * 2×2 on a phone, icon above the text. The reference stacks these one per row
 * (reference-analysis/mobile-390/Z-footer.png), which cost 364px for four
 * short statements; 2×2 says the same in about half.
 */
export function TrustRow({ items }: { items: TrustItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
      {items.map((item) => {
        const Icon = TRUST_ICONS[item.icon] ?? BadgeCheck;
        return (
          <li
            key={item.title}
            className="flex flex-col items-start gap-2 rounded-(--card-radius) border border-line bg-surface-card p-3 sm:flex-row sm:items-center sm:gap-3 lg:px-5 lg:py-4"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-dark lg:h-12 lg:w-12">
              <Icon size={20} strokeWidth={1.9} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-text-primary lg:text-[16px]">
                {item.title}
              </span>
              <span className="block text-[12px] text-text-secondary lg:text-[13px]">
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
        Güvenlik Teknolojileri Tedariki
      </h1>
      <h2 className="mt-1.5 text-[16px] font-medium text-text-secondary">
        Toptan ve perakende güvenlik sistemleri
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
          CCTV, network, alarm ve geçiş kontrol sistemleri…
        </strong>{' '}
        CCTV ve kayıt sistemlerinden network ürünlerine, alarm, yangın algılama ve geçiş
        kontrolünden uydu ve seslendirme sistemlerine kadar güvenlik altyapısının ürünlerini
        tek katalogda topluyoruz. Hem son kullanıcıya hem de kurumsal alıcıya aynı stok
        derinliğiyle hizmet veriyoruz.
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
