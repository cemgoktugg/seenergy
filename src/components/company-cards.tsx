/* eslint-disable @next/next/no-img-element */
/**
 * Referanslarımız · Çözüm Ortaklarımız · Projelerimiz — three cards side by
 * side near the foot of the homepage (2026-10-27, replacing the blog cards at
 * the client's request), each leading to its page. The same day the band left
 * the black full-bleed strip for a light panel with a technology ground
 * (circuit traces, dot matrix, scan beam) and smaller cards, which lift, sweep
 * a light across their picture and draw an accent line on hover.
 *
 * The visuals are built from what the site already has rather than stock
 * photography: the sectors the shop supplies as icons, the partner brands'
 * own logos, and the SEENERGY CCTV range composed for the hero. A server
 * component.
 */

import Link from 'next/link';
import { ArrowRight, Building2, Car, Factory, GraduationCap, HeartPulse, Store } from 'lucide-react';

import { SectionHeading } from '@/components/section-heading';

const SECTORS = [
  { icon: Factory, label: 'Fabrika ve depo' },
  { icon: Building2, label: 'Site ve konut' },
  { icon: Store, label: 'Mağaza ve AVM' },
  { icon: GraduationCap, label: 'Okul' },
  { icon: HeartPulse, label: 'Sağlık' },
  { icon: Car, label: 'Otopark' },
];

const PARTNERS = ['dahua', 'hikvision', 'unv', 'neutron', 'ruijie', 'tp-link'];

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
      className="group relative flex flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-1 hover:border-line-strong hover:shadow-e3"
    >
      <div className="relative">
        {visual}
        {/* A light sweep across the picture on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0 transition-[transform,opacity] duration-[900ms] ease-out group-hover:translate-x-[450%] group-hover:opacity-100 motion-reduce:hidden"
        />
      </div>
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
      {/* The accent line grows along the bottom edge on hover. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-grad-1 via-[rgb(195,19,28)] to-grad-4 transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-x-100"
      />
    </Link>
  );
}

export function CompanyCards() {
  return (
    <section
      aria-labelledby="company-cards-title"
      className="relative isolate overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-br from-surface-card via-surface-page to-[#e9edf2] px-4 py-6 shadow-e1 dt:px-8 dt:py-8"
    >
      {/* Technology ground: a circuit-board trace pattern, the site's dot
          matrix, a slow scan beam, and a soft light in the corner. */}
      <span aria-hidden className="circuit-ground pointer-events-none absolute inset-0 -z-10" />
      <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <span aria-hidden className="tech-scan pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 opacity-60" />
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-grad-1/20 blur-3xl" />

      <SectionHeading id="company-cards-title" eyebrow="Kurumsal" title="Referanslar ve Projeler" />
      <div className="mt-4 grid gap-(--space-grid-gap) md:grid-cols-3">
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
      </div>
    </section>
  );
}
