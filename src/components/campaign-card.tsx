/* eslint-disable @next/next/no-img-element */
/**
 * Campaign card — the one template behind every promotional tile on the site:
 * the two tiles beside the hero, the wide banner and the dual banners.
 *
 * All of them used to be the same sound-wave drawing, re-tinted, under a dark
 * scrim with white text on top. Repeated five times down the page it read as
 * a template nobody had filled in. The card is now built from what the shop
 * actually has:
 *
 *   tone           a brand surface picked per card in the admin — koyu,
 *                  grafit, gümüş or açık — so a row of cards can alternate.
 *                  Stored under the earlier palette's keys (koyu, mor,
 *                  turkuaz, acik), so saved cards keep their tone
 *   product image  shown whole on a light plate, the same plate the product
 *                  cards and the hero stand products on. A cut-out and a
 *                  photo on white both look placed there (multiply drops the
 *                  photo's white box), which a cut-out floating on colour
 *                  cannot promise for whatever gets uploaded
 *   photo          optional. A real campaign photograph covers the card
 *                  under a left-weighted scrim, when the shop has one
 *
 * Contrast is by construction: the two dark tones keep white text at 5.5:1 or
 * more where the copy sits, and the two light ones (gümüş, açık) use dark ink
 * at 10:1 or more.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { Tone } from '@/lib/medusa/vitrin';

type Size = 'tile' | 'wide' | 'half';

/* Gradient stops, not the themed brand tokens: --color-brand turns a lighter
   violet in dark mode, and white on it drops below the contrast these cards
   are built to. The stops stay the same in both themes. */
export const TONE: Record<Tone, { surface: string; ink: 'light' | 'dark' }> = {
  koyu: { surface: 'bg-chrome', ink: 'light' },
  /* "Grafit": steel into graphite — distinct from koyu's flat chrome. */
  mor: { surface: 'bg-linear-to-br from-grad-2 to-grad-3', ink: 'light' },
  /* "Gümüş": a brushed plate, light through the middle like the logo's sheen. */
  turkuaz: { surface: 'bg-linear-to-br from-silver-mid via-silver-light to-silver-mid', ink: 'dark' },
  acik: { surface: 'bg-linear-to-br from-wash-fixed to-white', ink: 'dark' },
};

/* Per size: the card's height, the copy's padding and type, and the plate's
   share of the width. The plate is withdrawn where the card is too small for
   a product to read (the hero tiles and the wide banner on a phone). */
const SIZE: Record<Size, { box: string; pad: string; title: string; plate: string; cta: 'link' | 'pill' }> = {
  tile: {
    box: 'aspect-[172/104] sm:aspect-[340/120] dt:aspect-auto dt:h-full',
    pad: 'px-3.5 sm:px-5 dt:px-6',
    title: 'text-[13px] sm:text-[16px] dt:text-[20px]',
    plate: 'hidden sm:block w-[38%] m-2.5 dt:m-3',
    cta: 'link',
  },
  wide: {
    box: 'h-[112px] sm:h-[132px] dt:h-[150px]',
    pad: 'px-4 dt:px-8',
    title: 'text-[16px] dt:text-[24px]',
    plate: 'hidden sm:block w-[26%] dt:w-[22%] m-2.5 dt:m-3',
    cta: 'pill',
  },
  half: {
    box: 'h-[150px] sm:h-[160px] dt:h-[186px]',
    pad: 'px-4 dt:px-6',
    title: 'text-[16px] dt:text-[20px]',
    plate: 'block w-[36%] m-2.5 dt:m-3',
    cta: 'pill',
  },
};

export interface CampaignCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  tone: Tone;
  productImage?: string;
  image?: string;
  size: Size;
  /** Above the fold (the hero tiles): load eagerly. */
  eager?: boolean;
}

export function CampaignCard({ eyebrow, title, subtitle, href, tone, productImage, image, size, eager }: CampaignCardProps) {
  const t = TONE[tone];
  const s = SIZE[size];
  // A photo always means white text on its scrim, whatever tone was picked.
  const light = image ? true : t.ink === 'light';
  const loading = eager ? 'eager' : 'lazy';

  return (
    <Link
      href={href}
      className={`group relative flex overflow-hidden rounded-(--panel-radius) shadow-e1 transition-shadow duration-(--duration-base) hover:shadow-e2 ${t.surface} ${s.box}`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt=""
            loading={loading}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.03]"
          />
          <span aria-hidden className="absolute inset-0 bg-linear-to-r from-chrome/92 via-chrome/60 to-chrome/10" />
        </>
      ) : tone === 'koyu' ? (
        /* The dark tone carries the identity as light, like the hero's copy
           panel, so it is not a flat black slab. */
        <>
          <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-grad-1/25 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-grad-4/30 blur-3xl" />
        </>
      ) : (
        /* One soft highlight on the coloured tones: depth without artwork. */
        <span aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      )}

      {/* --- copy -------------------------------------------------------- */}
      <div className={`relative z-10 flex min-w-0 flex-1 flex-col justify-center ${s.pad}`}>
        {eyebrow ? (
          <p
            className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] ${
              light ? 'text-white/75' : 'text-ink-fixed/60'
            }`}
          >
            <span aria-hidden className={`h-[3px] w-4 shrink-0 rounded-full dt:w-5 ${light ? 'bg-white/70' : 'bg-linear-to-r from-grad-1 to-grad-4'}`} />
            <span className="truncate">{eyebrow}</span>
          </p>
        ) : null}
        <p
          className={`mt-1 line-clamp-2 font-extrabold leading-[1.12] tracking-tight dt:mt-1.5 ${s.title} ${
            light ? 'text-white' : 'text-ink-fixed'
          }`}
        >
          {title}
        </p>
        {subtitle ? (
          <p className={`mt-1 line-clamp-2 text-[12px] leading-snug sm:text-[13px] dt:text-[14px] ${light ? 'text-white/75' : 'text-ink-fixed/70'}`}>
            {subtitle}
          </p>
        ) : null}
        {s.cta === 'pill' ? (
          <span
            className={`mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors duration-(--duration-fast) dt:mt-3 dt:text-[13px] ${
              /* grad-3, not brand: the light tone stays light in dark mode, so its
                 accent must not follow the theme either. */
              light ? 'bg-white text-ink-fixed group-hover:bg-white/90' : 'bg-grad-3 text-white group-hover:bg-ink-fixed'
            }`}
          >
            İncele
            <ArrowRight size={13} strokeWidth={2.5} aria-hidden className="transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className={`mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold dt:mt-3 ${light ? 'text-white/85 group-hover:text-white' : 'text-grad-3'}`}>
            İncele
            <ArrowRight size={12} strokeWidth={2.5} aria-hidden className="transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      {/* --- product plate ------------------------------------------------ */}
      {productImage && !image ? (
        <div
          className={`relative shrink-0 self-stretch overflow-hidden rounded-(--card-radius) bg-[radial-gradient(120%_100%_at_60%_35%,#ffffff_0%,#f5f5f8_60%,#eaeaf1_100%)] ${s.plate}`}
        >
          <img
            src={productImage}
            alt=""
            loading={loading}
            className="absolute inset-0 h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.06] dt:p-4"
          />
        </div>
      ) : null}
    </Link>
  );
}
