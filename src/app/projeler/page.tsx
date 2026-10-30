import type { Metadata } from 'next';

import { InfoPage } from '@/components/info-page';
import { PageSections, ProjectGrid } from '@/components/page-sections';
import { loadVitrin } from '@/lib/medusa/vitrin';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await loadVitrin();
  return { title: pages.projeler.title, description: pages.projeler.seo_description };
}

/**
 * /projeler — everything from admin → Vitrin → Projelerimiz sayfası: the
 * heading and lede, the project cards (Projeler; shown once the shop adds
 * one) and the headed text sections (project types, how a project runs…).
 */
export default async function ProjectsPage() {
  const { company, pages, pageSections, projects } = await loadVitrin();
  const page = pages.projeler;
  return (
    <InfoPage path="/projeler" eyebrow={page.eyebrow} title={page.title} lede={page.lede} company={company}>
      <ProjectGrid title={page.projects_title} projects={projects} />
      <PageSections sections={pageSections.filter((section) => section.page === 'projeler')} />
    </InfoPage>
  );
}
