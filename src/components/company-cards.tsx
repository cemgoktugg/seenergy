/* eslint-disable @next/next/no-img-element */
/**
 * Referanslarımız · Çözüm Ortaklarımız · Projelerimiz — three cards side by
 * side on the dark band near the foot of the homepage (2026-10-27, replacing
 * the blog cards at the client's request). Each card leads to its page.
 *
 * The visuals are built from what the site already has rather than stock
 * photography: the sectors the shop supplies as icons, the partner brands'
 * own logos, and the SEENERGY CCTV range composed for the hero. A server
 * component.
 */

import Link from 'next/link';
import { ArrowRight, Building2, Car, Factory, GraduationCap, HeartPulse, Store } from 'lucide-react';

const SECTORS = [
  { icon: Factory, label: 'Fabrika ve depo' },
  { icon: Building2, label: 'Site ve konut' },
  { icon: Store, label: 'Mağaza ve AVM' },
  { icon: GraduationCap, label: 'Okul' },
  { icon: HeartPulse, label: 'Sağlık' },
  { icon: Car, label: 'Otopark' },
];

const PARTNERS = ['dahua', 'hikvision', 'unv', 'neutron', 'ruijie', 'tp-link'];

const PLATE = 'relative h-[200px] overflow-hidden bg-[#f4f5f7] dt:h-[220px]';

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
      className="group flex flex-col overflow-hidden rounded-(--panel-radius) border border-white/10 bg-white/[0.04] transition-[transform,border-color,background-color] duration-(--duration-base) ease-(--ease-out) hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
    >
      {visual}
      <div className="flex flex-1 flex-col p-5 dt:p-6">
        <h3 className="text-[20px] font-extrabold tracking-tight text-white">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/65">{text}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-bold text-white">
          İncele
          <ArrowRight
            size={15}
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
    <div className="grid gap-(--space-grid-gap) md:grid-cols-3">
      <Card
        href="/referanslar"
        title="Referanslarımız"
        text="Fabrikadan siteye, okuldan otoparka; farklı sektörlerde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlıyoruz."
        visual={
          <div className={`${PLATE} grid grid-cols-3 content-center gap-2.5 px-5`}>
            {SECTORS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-(--card-radius) border border-[#dadde1] bg-white px-2 py-3 text-center text-[12px] font-semibold leading-tight text-ink-fixed shadow-e1"
              >
                <Icon size={20} strokeWidth={1.9} aria-hidden />
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
          <div className={`${PLATE} grid grid-cols-3 content-center gap-2.5 px-5`}>
            {PARTNERS.map((slug) => (
              <span
                key={slug}
                className="grid h-[58px] place-items-center rounded-(--card-radius) border border-[#dadde1] bg-white px-2.5 shadow-e1"
              >
                <img src={`/brands/${slug}.webp`} alt="" loading="lazy" className="max-h-7 w-auto max-w-full object-contain" />
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
              className="absolute inset-0 h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.04]"
            />
          </div>
        }
      />
    </div>
  );
}
