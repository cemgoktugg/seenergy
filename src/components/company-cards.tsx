/* eslint-disable @next/next/no-img-element */
/**
 * Referanslarımız · Çözüm Ortaklarımız · Projelerimiz — three cards side by
 * side near the foot of the homepage (2026-10-27, replacing the blog cards at
 * the client's request), each leading to its page. The same day the band left
 * the black full-bleed strip for a light panel with a technology ground:
 * circuit traces with signal pulses running along them, and the dot matrix.
 * The cards carry a pointer-following light — a glowing border and an inner
 * glow where the mouse is, and a slight 3D tilt (SpotlightCards, .spot-card).
 *
 * The visuals are built from what the site already has rather than stock
 * photography: the sectors the shop supplies as icons, the partner brands'
 * own logos, and the SEENERGY CCTV range composed for the hero. A server
 * component.
 */

import Link from 'next/link';
import { ArrowRight, Building2, Car, Factory, GraduationCap, HeartPulse, Store } from 'lucide-react';

import { SectionHeading } from '@/components/section-heading';
import { SpotlightCards } from '@/components/spotlight-cards';

const SECTORS = [
  { icon: Factory, label: 'Fabrika ve depo' },
  { icon: Building2, label: 'Site ve konut' },
  { icon: Store, label: 'Mağaza ve AVM' },
  { icon: GraduationCap, label: 'Okul' },
  { icon: HeartPulse, label: 'Sağlık' },
  { icon: Car, label: 'Otopark' },
];

const PARTNERS = ['dahua', 'hikvision', 'unv', 'neutron', 'ruijie', 'tp-link'];

/** Circuit traces in the panel's own coordinates (1320 × 480), kept to the
 *  edges and the gaps between the cards so they show around them. */
const TRACES = [
  'M0 40 H180 L210 70 H420',
  'M1320 52 H1120 L1090 82 H900',
  'M0 440 H140 L170 410 H360 L390 440 H560',
  'M1320 430 H1180 L1150 400 H960',
  'M440 0 V24 L470 54 H620',
  'M880 480 V456 L850 426 H700',
  'M20 120 V260 L50 290 V420',
  'M1300 110 V240 L1270 270 V400',
];

const PLATE = 'relative h-[150px] overflow-hidden bg-[#f4f5f7] dt:h-[160px]';

function Card({
  href,
  title,
  text,
  visual,
}: {
  href: string;
  title: string;
  text: string;
  visual: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-spot
      className="spot-card group relative flex flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1"
    >
      <div className="relative">{visual}</div>
      <div className="flex flex-1 flex-col p-4 dt:p-5">
        <h3 className="text-[16px] font-extrabold tracking-tight text-text-primary dt:text-[20px]">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{text}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-bold text-text-primary">
          İncele
          <ArrowRight
            size={14}
            strokeWidth={2.5}
            aria-hidden
            className="transition-transform duration-(--duration-fast) group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

export function CompanyCards() {
  return (
    <section
      aria-labelledby="company-cards-title"
      className="relative isolate overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-br from-surface-card via-surface-page to-[#e9edf2] px-4 py-6 shadow-e1 dt:px-8 dt:py-8"
    >
      {/* Technology ground: circuit traces with signals running along them,
          the site's dot matrix, and a soft light in the corner. */}
      <span aria-hidden className="circuit-ground pointer-events-none absolute inset-0 -z-10" />
      <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <svg
        aria-hidden
        viewBox="0 0 1320 480"
        preserveAspectRatio="xMidYMid slice"
        className="signal-traces pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        {TRACES.map((d, i) => (
          <g key={d}>
            <path d={d} className="signal-trace" />
            <path d={d} pathLength={1000} className="signal-pulse" style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${6 + (i % 3) * 1.5}s` }} />
          </g>
        ))}
      </svg>
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-grad-1/20 blur-3xl" />

      <SectionHeading id="company-cards-title" eyebrow="Kurumsal" title="Referanslar ve Projeler" />
      <SpotlightCards className="mt-4 grid gap-(--space-grid-gap) [perspective:1200px] md:grid-cols-3">
        <Card
          href="/referanslar"
          title="Referanslarımız"
          text="Fabrikadan siteye, okuldan otoparka; farklı sektörlerde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlıyoruz."
          visual={
            <div className={`${PLATE} grid grid-cols-3 content-center gap-2 px-4`}>
              {SECTORS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-(--card-radius) border border-[#dadde1] bg-white px-1.5 py-2 text-center text-[12px] font-semibold leading-tight text-ink-fixed shadow-e1 transition-transform duration-(--duration-base) group-hover:-translate-y-0.5"
                >
                  <Icon size={18} strokeWidth={1.9} aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          }
        />
        <Card
          href="/cozum-ortaklarimiz"
          title="Çözüm Ortaklarımız"
          text="Dahua, Hikvision, UNV, Neutron ve 30'dan fazla markayla birlikte çalışıyor; doğru ürünü yetkili kanaldan sunuyoruz."
          visual={
            <div className={`${PLATE} grid grid-cols-3 content-center gap-2 px-4`}>
              {PARTNERS.map((slug) => (
                <span
                  key={slug}
                  className="grid h-[46px] place-items-center rounded-(--card-radius) border border-[#dadde1] bg-white px-2 shadow-e1 transition-transform duration-(--duration-base) group-hover:-translate-y-0.5"
                >
                  <img src={`/brands/${slug}.webp`} alt="" loading="lazy" className="max-h-6 w-auto max-w-full object-contain" />
                </span>
              ))}
            </div>
          }
        />
        <Card
          href="/projeler"
          title="Projelerimiz"
          text="Keşiften kuruluma kadar yanınızdayız: kamera, kayıt, network ve uzak saha (4G, solar) projeleri için çözüm üretiyoruz."
          visual={
            <div className={PLATE}>
              <img
                src="/hero/seenergy-cctv.webp"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.05]"
              />
            </div>
          }
        />
      </SpotlightCards>
    </section>
  );
}
