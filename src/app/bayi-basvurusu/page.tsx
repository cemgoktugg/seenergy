import type { Metadata } from 'next';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Bayi Başvurusu',
  description: 'SEENERGY yetkili satıcısı olun: bayi başvuru formu.',
};

export default async function DealerPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/bayi-basvurusu"
      eyebrow="Kurumsal"
      title="Yetkili Satıcımız Olun"
      lede="SEENERGY güvenlik ürünlerini bölgenizde satmak ve kurmak için bayi başvurunuzu bırakın."
      company={company}
    >
      <h2>Kimler başvurabilir?</h2>
      <ul>
        <li>Güvenlik sistemi kurulum ve servis firmaları,</li>
        <li>Elektrik, elektronik ve bilişim ürünleri satıcıları,</li>
        <li>Proje ve taahhüt firmaları.</li>
      </ul>
      <h2>Süreç</h2>
      <ol>
        <li>Başvurunuzu aşağıdaki formla iletin.</li>
        <li>Satış ekibimiz sizinle görüşerek çalışma koşullarını paylaşır.</li>
        <li>Anlaşmanın ardından bayi hesabınız tanımlanır.</li>
      </ol>

      <h2>Başvuru formu</h2>
      <InquiryForm
        type="bayi"
        fields={[
          ...CONTACT_FIELDS,
          { name: 'company', label: 'Firma unvanı', required: true, autoComplete: 'organization' },
          { name: 'city', label: 'İl', required: true },
          { name: 'tax_number', label: 'Vergi numarası', required: true },
          {
            name: 'business',
            label: 'Faaliyet alanı',
            type: 'select',
            required: true,
            options: ['Güvenlik sistemi kurulum firması', 'Elektrik / elektronik malzeme satıcısı', 'Bilişim / network firması', 'Proje / taahhüt firması', 'Diğer'],
          },
          {
            name: 'message',
            label: 'Firmanızı kısaca tanıtın',
            type: 'textarea',
            placeholder: 'Faaliyet yılı, hizmet verdiğiniz bölge, çalıştığınız markalar…',
          },
        ]}
        submitLabel="Başvuruyu gönder"
        successTitle="Başvurunuz alındı"
        successText="Satış ekibimiz başvurunuzu inceleyip sizinle iletişime geçecek."
      />
    </InfoPage>
  );
}
