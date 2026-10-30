/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { PageSections } from '@/components/page-sections';
import { imageProps } from '@/lib/image';
import { loadVitrin } from '@/lib/medusa/vitrin';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await loadVitrin();
  const page = pages['cozum-ortaklarimiz'];
  return { title: page.title, description: page.seo_description };
}

/**
 * /cozum-ortaklarimiz — the brand wall's logos (admin → Vitrin → Marka
 * duvarı, the same list the homepage scrolls), each linking to its page,
 * under the heading and lede of Vitrin → Çözüm Ortaklarımız sayfası; then
 * its text sections. {sayi} in the lede is the number of brands.
 */
export default async function PartnersPage() {
  const { company, pages, pageSections, brandWall } = await loadVitrin();
  const page = pages['cozum-ortaklarimiz'];
  return (
    <InfoPage
      path="/cozum-ortaklarimiz"
      eyebrow={page.eyebrow}
      title={page.title}
      lede={page.lede.replaceAll('{sayi}', String(brandWall.length))}
      company={company}
    >
      <ul className="not-prose grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {brandWall.map((brand) => (
          <li key={`${brand.name}-${brand.href}`}>
            <Link
              href={brand.href}
              title={brand.name}
              aria-label={brand.name}
              className="flex h-[76px] items-center justify-center rounded-(--card-radius) border border-line bg-white px-4 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2"
            >
              <img {...imageProps(brand.logo, 132)} alt="" loading="lazy" className="h-9 w-[132px] object-contain" />
            </Link>
          </li>
        ))}
      </ul>

      <PageSections sections={pageSections.filter((section) => section.page === 'cozum-ortaklarimiz')} />
    </InfoPage>
  );
}
