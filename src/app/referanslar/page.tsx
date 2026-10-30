import type { Metadata } from 'next';

import { InfoPage } from '@/components/info-page';
import { PageSections, ReferenceGrid } from '@/components/page-sections';
import { loadVitrin } from '@/lib/medusa/vitrin';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await loadVitrin();
  return { title: pages.referanslar.title, description: pages.referanslar.seo_description };
}

/**
 * /referanslar — everything from admin → Vitrin → Referanslarımız sayfası:
 * the heading and lede, the client cards (Referanslar; none until the shop
 * adds clients who agreed to be named) and the headed text sections.
 */
export default async function ReferencesPage() {
  const { company, pages, pageSections, references } = await loadVitrin();
  const page = pages.referanslar;
  return (
    <InfoPage path="/referanslar" eyebrow={page.eyebrow} title={page.title} lede={page.lede} company={company}>
      <ReferenceGrid title={page.references_title} references={references} />
      <PageSections sections={pageSections.filter((section) => section.page === 'referanslar')} />
    </InfoPage>
  );
}
