/* eslint-disable @next/next/no-img-element */
/**
 * "Markalarımız" — the two brand cards under "Öne Çıkanlar" (2026-10-24: moved
 * up from the dark blog band at the client's request, and redesigned).
 *
 * They used to be two campaign tiles with a mock receiver and a mock camera
 * beside the copy. Now each card shows what it is about:
 *   - Tescilli Markalarımız: a brushed-steel card (the category bar's metal)
 *     with the SEENERGY wordmark, white, carrying the logo's glint.
 *   - Resmi Yetkili Satıcısı Olduğumuz Markalar: a light steel card with the
 *     authorised brands' logos as tiles, each linking to that brand.
 *
 * Copy and links come from admin → Vitrin → Bannerlar (the `dual-1` / `dual-2`
 * slots); the brand tiles from admin → Vitrin → Marka panosu, so a brand added
 * there appears here too. A server component.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { BrandLogo } from '@/components/brand-mark';
import type { Banner } from '@/lib/medusa/vitrin';

export interface PartnerBrand {
  name: string;
  href: string;
  logo: string;
}

function Eyebrow({ text, dark }: { text?: string; dark?: boolean }) {
  if (!text) return null;
  return (
    <p
      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] dt:text-[11px] ${
        dark ? 'text-white/60' : 'text-text-secondary'
      }`}
    >
      <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
      {text}
    </p>
  );
}

export function BrandShowcase({ own, partners, brands }: { own: Banner; partners: Banner; brands: PartnerBrand[] }) {
  return (
    <div className="grid gap-(--space-grid-gap) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* --- own brands: brushed steel ----------------------------------- */}
      <Link
        href={own.href}
        className="nav-metal group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-(--panel-radius) p-6 text-white shadow-e2 transition-shadow duration-(--duration-base) hover:shadow-e3 dt:p-8"
      >
        <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.08] blur-3xl" />
        <div className="relative">
          <Eyebrow text={own.eyebrow} dark />
          <h3 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight dt:text-[26px]">{own.title}</h3>
          {own.subtitle ? <p className="mt-1.5 max-w-[42ch] text-[13px] text-white/65">{own.subtitle}</p> : null}
        </div>
        <div className="relative mt-6 flex items-end justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-ink-fixed shadow-lg shadow-black/30 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5">
            İncele
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
          </span>
          <BrandLogo shine tone="light" className="flex h-9 w-auto shrink-0 dt:h-12" />
        </div>
      </Link>

      {/* --- authorised brands: light steel, logo tiles -------------------- */}
      <div className="relative flex flex-col overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-br from-surface-card via-surface-card to-wash-fixed p-6 shadow-e1 dt:p-8">
        <span aria-hidden className="pointer-events-none absolute -left-16 -bottom-20 h-56 w-56 rounded-full bg-grad-1/20 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow text={partners.eyebrow} />
            <h3 className="mt-2 text-[20px] font-extrabold leading-tight tracking-tight text-text-primary text-balance dt:text-[24px]">
              {partners.title}
            </h3>
          </div>
          <Link
            href={partners.href}
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-[12.5px] font-bold text-text-primary transition-colors duration-(--duration-fast) hover:border-text-primary sm:inline-flex"
          >
            İncele
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
        <ul className="relative mt-5 grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4 dt:gap-3">
          {brands.map((brand) => (
            <li key={brand.href}>
              <Link
                href={brand.href}
                title={brand.name}
                aria-label={brand.name}
                className="group/tile flex h-full min-h-[76px] items-center justify-center rounded-(--card-radius) border border-line bg-white px-4 py-3 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-1 hover:border-line-strong hover:shadow-e2 dt:min-h-[96px]"
              >
                <img
                  src={brand.logo}
                  alt=""
                  loading="lazy"
                  className="max-h-[38px] w-auto max-w-full object-contain transition-transform duration-(--duration-base) group-hover/tile:scale-105 dt:max-h-[46px]"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
