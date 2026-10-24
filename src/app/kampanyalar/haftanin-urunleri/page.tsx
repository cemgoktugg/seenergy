import type { Metadata } from 'next';

import type { SearchParams } from '@/lib/catalog-query';
import { VitrinListPage } from '@/lib/vitrin-list-page';

export const metadata: Metadata = {
  title: 'Haftanın Ürünleri',
  description: 'Bu hafta öne çıkardığımız güvenlik ve elektronik ürünleri.',
};

export default function WeeklyPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <VitrinListPage
      listKey="haftanin"
      title="Haftanın Ürünleri"
      eyebrow="Bu hafta öne çıkanlar"
      description="Bu hafta öne çıkardığımız ürünler. Liste her hafta yenilenir."
      basePath="/kampanyalar/haftanin-urunleri"
      searchParams={searchParams}
    />
  );
}
