import type { Metadata } from 'next';

import type { SearchParams } from '@/lib/catalog-query';
import { VitrinListPage } from '@/lib/vitrin-list-page';

export const metadata: Metadata = {
  title: 'Süper Fırsat Ürünleri',
  description: 'İndirimli ve fırsat ürünleri.',
};

export default function DealsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <VitrinListPage
      listKey="super-firsat"
      title="Süper Fırsat Ürünleri"
      eyebrow="Kampanya"
      description="Sınırlı stoklu fırsat ürünleri ve indirimler."
      basePath="/kampanyalar/super-firsat"
      searchParams={searchParams}
    />
  );
}
