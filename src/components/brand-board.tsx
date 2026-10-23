/* eslint-disable @next/next/no-img-element */
/**
 * Brand board — four cards under the hero, one per brand (2026-10-22: it
 * replaced the category board at the client's request — "no categories here,
 * the brands' logos in four squares, their models on hover").
 *
 *   - Rest: a white logo stage, brand name, model availability and an arrow.
 *   - Hover / keyboard focus (fine pointers): a dark panel slides up over the
 *     card and lists the models — picture, code, short name — each linking
 *     to its page, with "Tüm modeller" to the brand's listing.
 *   - Touch: no hover to wait for; the whole card opens the brand page.
 *
 * Content: admin → Vitrin → Marka panosu (brand + logo), the models from the
 * catalogue — a product filed under the brand in the admin appears on its own.
 * A brand with no products yet keeps its logo visible and says "Modeller
 * yakında". Model lists scroll inside the more compact cards when needed.
 *
 * Headed by a dark strip (2026-10-22, the client's call): the wide campaign
 * banner that stood further down the page — eyebrow, title, subtitle, link,
 * product picture — moved here as the board's title, in one frame with the
 * squares. Its content is still admin → Vitrin → Bannerlar → "Marka panosu
 * başlığı" (the `wide` slot).
 *
 * A server component: the hover is CSS (`group-hover`, `focus-within`).
 */

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import type { Banner } from '@/lib/medusa/vitrin';

export interface BrandBoardModel {
  label: string;
  detail: string;
  image: string;
  href: string;
}

export interface BrandBoardEntry {
  name: string;
  href: string;
  logo: string;
  models: BrandBoardModel[];
}

/** Models listed in the panel before "Tüm modeller" takes over. */
const LIMIT = 4;

/** The board's title strip — the former wide banner. */
function BoardHeader({ header }: { header: Banner }) {
  return (
    <div className="relative isolate flex flex-wrap items-center gap-x-6 gap-y-5 overflow-hidden bg-chrome px-5 py-6 text-white sm:flex-nowrap sm:px-7 dt:gap-x-8 dt:px-8">
      {header.image ? (
        <>
          <img src={header.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span aria-hidden className="absolute inset-0 bg-linear-to-r from-chrome/92 via-chrome/70 to-chrome/20" />
        </>
      ) : (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-r from-chrome via-chrome to-chrome-soft" />
          <span aria-hidden className="pointer-events-none absolute -right-12 -top-36 h-96 w-96 rounded-full bg-grad-1/15 blur-3xl" />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/6"
          />
          <span aria-hidden className="pointer-events-none absolute -right-10 top-1/2 h-[308px] w-[308px] -translate-y-1/2 rounded-full border border-white/8" />
        </>
      )}

      <div className="relative min-w-0 basis-full sm:flex-1 sm:basis-auto">
        {header.eyebrow ? (
          <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65 dt:text-[10.5px]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-silver-mid ring-4 ring-white/5" />
            {header.eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2.5 text-[22px] font-bold leading-[1.2] tracking-[-0.025em] sm:text-[25px] dt:text-[29px]">
          {header.title}
        </h2>
        {header.subtitle ? (
          <p className="mt-2 max-w-[60ch] text-[12.5px] leading-relaxed text-white/65 dt:text-[14px]">{header.subtitle}</p>
        ) : null}
      </div>

      <Link
        href={header.href}
        className="group/cta relative inline-flex min-h-11 shrink-0 items-center gap-4 rounded-xl border border-white/20 bg-white/8 px-4 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors duration-(--duration-fast) hover:border-white/40 hover:bg-white hover:text-ink-fixed"
      >
        İncele
        <ArrowRight
          size={15}
          strokeWidth={1.8}
          aria-hidden
          className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
        />
      </Link>

      {header.productImage && !header.image ? (
        <span aria-hidden className="relative hidden h-[112px] w-[160px] shrink-0 items-center justify-center md:flex dt:w-[196px]">
          <span className="absolute h-32 w-32 rounded-full bg-white/5 ring-1 ring-white/10" />
          <img src={header.productImage} alt="" loading="lazy" className="relative h-full w-full object-contain px-5 drop-shadow-[0_12px_12px_rgb(0_0_0/0.25)]" />
        </span>
      ) : null}
    </div>
  );
}

export function BrandBoard({ items, header }: { items: BrandBoardEntry[]; header?: Banner }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line-strong/70 bg-surface-page">
      {header ? <BoardHeader header={header} /> : null}
      <ul className="grid grid-cols-2 gap-2.5 p-3 sm:gap-3.5 sm:p-4 lg:grid-cols-4 dt:gap-4 dt:p-5">
      {items.map((item) => (
        <li
          key={item.href}
          className="group/b relative flex h-[184px] min-w-0 flex-col overflow-hidden rounded-[16px] border border-line-strong/60 bg-surface-card transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2 sm:h-[216px] dt:h-[232px]"
        >
          {/* --- rest face ------------------------------------------------ */}
          <Link
            href={item.href}
            aria-label={`${item.name} — ${item.models.length > 0 ? `${item.models.length} model` : 'modeller yakında'}`}
            className="flex h-full flex-col"
          >
            <span className="relative m-2 mb-0 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[10px] bg-white px-4 sm:px-6 dt:px-8">
              {/* Always on white, in both themes: the brand colours are the
                  logo's own and must not be inverted. */}
              <img
                src={item.logo}
                alt=""
                loading="lazy"
                className="max-h-[64px] w-auto max-w-full object-contain transition-transform duration-(--duration-slow) ease-out group-hover/b:scale-105 sm:max-h-[72px] dt:max-h-[80px]"
              />
            </span>
            <span className="relative mx-3 flex shrink-0 items-center justify-between gap-2 border-t border-line py-3 sm:mx-4 sm:py-3.5">
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-bold text-text-primary sm:text-[14px]">{item.name}</span>
                <span className="mt-0.5 block text-[10px] leading-snug text-text-secondary sm:text-[11.5px]">
                  {item.models.length > 0 ? `${item.models.length} modeli keşfet` : 'Modeller yakında'}
                </span>
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong/70 bg-surface-page text-text-secondary transition-colors duration-(--duration-fast) group-hover/b:border-brand group-hover/b:bg-brand group-hover/b:text-white sm:h-9 sm:w-9">
                <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden />
              </span>
            </span>
          </Link>

          {/* --- hover panel (fine pointers only) -------------------------
              Slides up over the card. Hidden from touch, where a first tap
              would otherwise open it and a second one navigate. */}
          {item.models.length > 0 ? (
            <div className="pointer-events-none absolute inset-0 hidden translate-y-full flex-col bg-chrome text-white opacity-0 transition-[transform,opacity] duration-(--duration-base) ease-out pointer-fine:flex group-focus-within/b:pointer-events-auto group-focus-within/b:translate-y-0 group-focus-within/b:opacity-100 group-hover/b:pointer-events-auto group-hover/b:translate-y-0 group-hover/b:opacity-100">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-grad-1/25 blur-3xl"
              />
              <div className="relative flex shrink-0 items-center justify-between gap-2 px-4 pb-2 pt-3 dt:px-5">
                <p className="text-[15px] font-extrabold tracking-tight">{item.name}</p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-white/80">
                  {item.models.length} model
                </span>
              </div>

              <ul className="relative min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2.5 [scrollbar-width:thin] dt:px-3">
                {item.models.slice(0, LIMIT).map((model) => (
                  <li key={model.href}>
                    <Link
                      href={model.href}
                      className="flex items-center gap-2.5 rounded-(--card-radius) px-1.5 py-1 transition-colors duration-(--duration-fast) hover:bg-white/10"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-0.5">
                        <img src={model.image} alt="" loading="lazy" className="h-full w-full object-contain" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-bold">{model.label}</span>
                        <span className="block truncate text-[11px] text-white/60">{model.detail}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={item.href}
                className="relative mx-3 mb-3 mt-2 inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 text-[12px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) hover:bg-wash-fixed dt:mx-4"
              >
                {item.models.length > LIMIT ? `Tüm modeller (${item.models.length})` : 'Marka sayfası'}
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
          ) : null}
        </li>
      ))}
      </ul>
    </div>
  );
}
