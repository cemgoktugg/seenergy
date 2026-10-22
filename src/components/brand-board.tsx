/* eslint-disable @next/next/no-img-element */
/**
 * Brand board — four squares under the hero, one per brand (2026-10-22: it
 * replaced the category board at the client's request — "no categories here,
 * the brands' logos in four squares, their models on hover").
 *
 *   - Rest: the brand's logo on a white square, and how many models it has.
 *   - Hover / keyboard focus (fine pointers): a dark panel slides up over the
 *     square and lists the models — picture, code, short name — each linking
 *     to its page, with "Tüm modeller" to the brand's listing.
 *   - Touch: no hover to wait for; the whole square opens the brand page.
 *
 * Content: admin → Vitrin → Marka panosu (brand + logo), the models from the
 * catalogue — a product filed under the brand in the admin appears on its own.
 * A brand with no products yet says so instead of showing an empty panel.
 *
 * A server component: the hover is CSS (`group-hover`, `focus-within`).
 */

import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

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

export function BrandBoard({ items }: { items: BrandBoardEntry[] }) {
  return (
    <ul className="grid grid-cols-2 gap-(--space-grid-gap) dt:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.href}
          className="group/b relative aspect-square overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 transition-[box-shadow,border-color] duration-(--duration-base) hover:border-line-strong hover:shadow-e3"
        >
          {/* --- rest face ------------------------------------------------ */}
          <Link
            href={item.href}
            aria-label={`${item.name} — ${item.models.length > 0 ? `${item.models.length} model` : 'modeller yakında'}`}
            className="absolute inset-0 flex flex-col"
          >
            <span className="relative grid flex-1 place-items-center px-[14%]">
              {/* Always on white, in both themes: the brand colours are the
                  logo's own and must not be inverted. */}
              <span className="grid w-full place-items-center rounded-(--card-radius) bg-white px-3 py-4">
                <img
                  src={item.logo}
                  alt=""
                  loading="lazy"
                  className="max-h-[88px] w-auto max-w-full object-contain transition-transform duration-(--duration-slow) ease-out group-hover/b:scale-105 dt:max-h-[96px]"
                />
              </span>
            </span>
            {/* Below `sm` the name gives way: the logo already says it, and the
                row has room for one phrase. */}
            <span className="relative flex items-center justify-center gap-2 border-t border-line px-3 py-2.5 text-[12px] sm:justify-between sm:px-4 sm:py-3 sm:text-[12.5px] dt:px-5 dt:py-3.5 dt:text-[13px]">
              <span className="hidden font-bold text-text-primary sm:inline">{item.name}</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-text-secondary">
                {item.models.length > 0 ? `${item.models.length} model` : 'Modeller yakında'}
                <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
              </span>
            </span>
          </Link>

          {/* --- hover panel (fine pointers only) -------------------------
              Slides up over the square. Hidden from touch, where a first tap
              would otherwise open it and a second one navigate. */}
          <div className="pointer-events-none absolute inset-0 hidden translate-y-full flex-col bg-chrome text-white opacity-0 transition-[transform,opacity] duration-(--duration-base) ease-out pointer-fine:flex group-focus-within/b:pointer-events-auto group-focus-within/b:translate-y-0 group-focus-within/b:opacity-100 group-hover/b:pointer-events-auto group-hover/b:translate-y-0 group-hover/b:opacity-100">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-grad-1/25 blur-3xl"
            />
            <div className="relative flex items-center justify-between gap-2 px-4 pb-2 pt-4 dt:px-5">
              <p className="text-[15px] font-extrabold tracking-tight">{item.name}</p>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-white/80">
                {item.models.length} model
              </span>
            </div>

            {item.models.length > 0 ? (
              <ul className="relative min-h-0 flex-1 space-y-0.5 overflow-hidden px-2.5 dt:px-3">
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
            ) : (
              <p className="relative flex-1 px-4 text-[13px] leading-relaxed text-white/70 dt:px-5">
                {item.name} modelleri yakında bu vitrinde. Fiyat ve stok bilgisi için bizimle iletişime geçebilirsiniz.
              </p>
            )}

            <Link
              href={item.href}
              className="relative mx-4 mb-4 mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[12.5px] font-bold text-ink-fixed transition-transform duration-(--duration-fast) hover:-translate-y-px dt:mx-5"
            >
              {item.models.length > LIMIT ? `Tüm modeller (${item.models.length})` : 'Marka sayfası'}
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
