/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { BRANDS } from '@/data/site';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Çözüm Ortaklarımız',
  description:
    'SEENERGY Güvenlik Teknolojileri olarak birlikte çalıştığımız markalar: Dahua, Hikvision, UNV, Neutron, Ruijie, TP-Link ve daha fazlası.',
};

/** Every brand on the homepage's brand wall, each tile linking to its page. */
export default async function PartnersPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/cozum-ortaklarimiz"
      eyebrow="Kurumsal"
      title="Çözüm Ortaklarımız"
      lede={`Kendi markamız SEENERGY ile birlikte ${BRANDS.length} markanın ürünlerini sunuyoruz. Bir markaya tıklayarak ürünlerine ulaşabilirsiniz.`}
      company={company}
    >
      <ul className="not-prose grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {BRANDS.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={brand.href}
              title={brand.name}
              aria-label={brand.name}
              className="flex h-[76px] items-center justify-center rounded-(--card-radius) border border-line bg-white px-4 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2"
            >
              <img src={brand.image} alt="" loading="lazy" className="h-9 w-[132px] object-contain" />
            </Link>
          </li>
        ))}
      </ul>

      <h2>Neden önemli?</h2>
      <p>
        Ürünleri yetkili kanallardan, faturalı ve garantili olarak tedarik ediyoruz. Projenize uygun markayı ve
        modeli birlikte seçmek için <Link href="/kurumsal">kurumsal satış ve proje</Link> formundan bize
        ulaşabilirsiniz.
      </p>
    </InfoPage>
  );
}
