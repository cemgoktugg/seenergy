import type { Metadata } from 'next';

import type { SearchParams } from '@/lib/catalog-query';
import { VitrinListPage } from '@/lib/vitrin-list-page';

export const metadata: Metadata = {
  title: 'Yeni Gelenler',
  description: 'Rafa yeni giren güvenlik ve elektronik ürünleri.',
};

export default function NewArrivalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <VitrinListPage
      listKey="yeni"
      title="Yeni Gelenler"
      eyebrow="Rafa yeni girenler"
      description="Kataloğumuza son eklenen ürünler."
      basePath="/yeni-gelenler"
      searchParams={searchParams}
    />
  );
}
