/**
 * "Firmamız Hakkında" — the company's own statement, near the foot of the
 * homepage (2026-10-27, replacing the "Güvenlik Teknolojileri Tedariki" SEO
 * block at the client's request). The copy is the client's, with only typing
 * slips corrected; its three strategic pillars are pulled out as tiles and
 * its closing line set as the band's last word. A server component.
 *
 * The removed block held the homepage's only h1; it moves here, visually
 * hidden, so the page keeps one.
 */

import Link from 'next/link';
import { ArrowRight, Globe2, Handshake, Lightbulb, Users } from 'lucide-react';

import { SectionHeading } from '@/components/section-heading';

const PILLARS = [
  { icon: Lightbulb, title: 'Yaratıcılık', text: 'Teknoloji, ürün ve çözümlerde yeniliklere öncülük etmek.' },
  { icon: Handshake, title: 'Ortaklık', text: 'Çalışanlarımız ve ortaklarımızla paylaştığımız değerler.' },
  { icon: Users, title: 'İnsan Gücü', text: 'Uzman ekiplerimizle üst düzeyde hizmet.' },
];

export function AboutCompany() {
  return (
    <section
      aria-labelledby="about-company-title"
      className="relative isolate overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card px-5 py-7 shadow-e1 dt:px-10 dt:py-10"
    >
      <h1 className="sr-only">SEENERGY Güvenlik Teknolojileri — güvenlik kameraları, kayıt cihazları ve network ürünleri</h1>
      <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <div className="grid gap-8 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-12">
        <div>
          <SectionHeading id="about-company-title" eyebrow="Kurumsal" title="Firmamız Hakkında" />
          <div className="mt-4 max-w-[68ch] space-y-3.5 text-[14px] leading-[1.75] text-text-secondary dt:text-[16px]">
            <p>
              Zengin dijital deneyimlerle dolu daha iyi bir dünya oluşturma arzumuza katılan tüm dünyadaki
              topluluklara ilham veren teknoloji, ürün ve çözümler konusunda yeniliklere öncülük etme
              sorumluluğumuzun merkezinde bulunmaktadır.
            </p>
            <p>
              Küresel toplumdaki yaratıcı bir firma olma sorumluluğumuzu bilerek çalışanlarımızın ve
              ortaklarımızın paylaştığı değerleri karşılarken ayrıca çaba ve kaynaklarımızı endüstri ve
              müşterilere yeni değerler sunmaya adamış bulunmaktayız.{' '}
              <strong className="font-semibold text-text-primary">Seenergy Güvenlik Teknolojileri A.Ş.</strong> olarak
              hep birlikte heyecan ve ümit verici bir gelecek oluşturmak istiyoruz.
            </p>
            <p>
              Operasyonel mükemmellik ve yenilik cesareti sayesinde Türkiye&apos;nin en iyi ürünlerini sunma
              konusunda kendimizle gurur duymaktayız. Seenergy Güvenlik Teknolojileri A.Ş. olarak mevcut
              başarılarını, rekabet gücünü ve kalite konusundaki geçmişini daha ileriye taşıyıp uzman
              ekiplerimizle üst düzeyde hizmet vermeye devam edeceğiz.
            </p>
          </div>
          <Link
            href="/hakkimizda"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[14px] font-bold text-text-primary transition-colors duration-(--duration-fast) hover:border-text-primary"
          >
            Hakkımızda
            <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[14px] leading-relaxed text-text-secondary">
            Kültürümüzün, iş faaliyetlerimizin ve yönetimimizin parçası olan üç ana stratejik dayanak:
          </p>
          <ul className="grid gap-2.5">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-center gap-4 rounded-(--card-radius) border border-line bg-surface-page px-4 py-3.5"
              >
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1"
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-[16px] font-extrabold tracking-tight text-text-primary">{title}</span>
                  <span className="block text-[13px] leading-snug text-text-secondary">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          {/* The statement's closing line, as the band's last word. */}
          <p className="nav-metal relative mt-auto flex items-center gap-3 overflow-hidden rounded-(--card-radius) px-5 py-4 text-[16px] font-extrabold tracking-tight text-white dt:text-[20px]">
            <Globe2 size={24} strokeWidth={1.9} aria-hidden className="shrink-0" />
            Bugün Türkiye&apos;de, yarın Dünya&apos;da...
          </p>
        </div>
      </div>
    </section>
  );
}
