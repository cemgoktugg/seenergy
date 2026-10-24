import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Toptan Satış',
  description: 'Kurulum firmaları ve satıcılar için toptan güvenlik ürünleri: toptan fiyat ve stok bilgisi.',
};

export default async function WholesalePage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/toptan-satis"
      eyebrow="Kurumsal"
      title="Toptan Satış"
      lede="Kurulum firmaları, elektrik-elektronik satıcıları ve proje firmaları için toptan fiyat ve stok bilgisi."
      company={company}
    >
      <h2>Toptan alımın avantajları</h2>
      <ul>
        <li>Adede göre kademeli toptan fiyat,</li>
        <li>SEENERGY ürünlerinde doğrudan marka sahibinden tedarik,</li>
        <li>Teknik föy ve ürün seçiminde destek,</li>
        <li>Faturalı, garantili ürün ve düzenli stok bilgisi.</li>
      </ul>
      <p>
        Düzenli alım yapacaksanız <Link href="/bayi-basvurusu">bayi başvurusu</Link> da yapabilirsiniz.
      </p>

      <h2>Toptan fiyat talebi</h2>
      <InquiryForm
        type="toptan"
        fields={[
          ...CONTACT_FIELDS,
          { name: 'company', label: 'Firma unvanı', required: true, autoComplete: 'organization' },
          { name: 'city', label: 'İl', required: true },
          {
            name: 'business',
            label: 'Faaliyet alanı',
            type: 'select',
            options: ['Güvenlik sistemi kurulum firması', 'Elektrik / elektronik malzeme satıcısı', 'Proje / taahhüt firması', 'E-ticaret satıcısı', 'Diğer'],
          },
          { name: 'tax_number', label: 'Vergi numarası', placeholder: 'İsteğe bağlı' },
          {
            name: 'message',
            label: 'İstediğiniz ürünler ve adetler',
            type: 'textarea',
            required: true,
            placeholder: 'Örn. SE-1080LD × 20, SE-8000 × 4…',
          },
        ]}
        submitLabel="Toptan fiyat iste"
        successTitle="Talebiniz alındı"
        successText="Satış ekibimiz toptan fiyat ve stok bilgisiyle en kısa sürede size dönüş yapacak."
      />
    </InfoPage>
  );
}
