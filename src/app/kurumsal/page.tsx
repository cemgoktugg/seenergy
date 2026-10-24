import type { Metadata } from 'next';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Kurumsal Satış ve Proje Teklifi',
  description: 'Site, fabrika, ofis ve kamu projeleri için güvenlik sistemi ürün listesi ve fiyat teklifi.',
};

export default async function CorporatePage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/kurumsal"
      eyebrow="Kurumsal"
      title="Kurumsal Satış ve Proje Teklifi"
      lede="Çok kameralı projeler, site ve fabrika kurulumları için ihtiyacınızı yazın; ürün listesini ve fiyat teklifini birlikte hazırlayalım."
      company={company}
    >
      <h2>Nasıl çalışıyoruz?</h2>
      <ol>
        <li>Projenizi ve ihtiyacınızı aşağıdaki formla iletin; mümkünse kamera sayısını ve kurulum yerini belirtin.</li>
        <li>Teknik ekibimiz kamera, kayıt cihazı, disk ve aksesuar listesini hazırlar.</li>
        <li>Stok ve teslim süresiyle birlikte kurumsal fiyat teklifimizi iletiriz.</li>
        <li>Onayınızla siparişiniz faturalı olarak gönderilir.</li>
      </ol>

      <h2>Teklif formu</h2>
      <InquiryForm
        type="kurumsal"
        fields={[
          ...CONTACT_FIELDS,
          { name: 'company', label: 'Firma / kurum', required: true, autoComplete: 'organization' },
          { name: 'city', label: 'İl', required: true },
          {
            name: 'business',
            label: 'Proje türü',
            type: 'select',
            options: ['Site / apartman', 'Fabrika / depo', 'Ofis / mağaza', 'Okul / hastane / kamu', 'Otopark / çevre güvenliği', 'Diğer'],
          },
          { name: 'quantity', label: 'Yaklaşık kamera sayısı', type: 'number', placeholder: 'Örn. 16' },
          {
            name: 'message',
            label: 'Proje detayları',
            type: 'textarea',
            required: true,
            placeholder: 'Kurulum yeri, iç/dış mekân, gece görüşü ihtiyacı, kayıt süresi, istediğiniz ürün kodları…',
          },
        ]}
        submitLabel="Teklif iste"
        successTitle="Proje talebiniz alındı"
        successText="Teknik ekibimiz ihtiyacınızı inceleyip en geç bir iş günü içinde size dönüş yapacak."
      />
    </InfoPage>
  );
}
