import type { Metadata } from 'next';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'İş İlanları',
  description: 'Ekibimize katılın: iş başvuru formu.',
};

/* No vacancies are listed — there is no data for any — so the page takes
   open applications instead of inventing positions. */
export default async function CareersPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/is-ilanlari"
      eyebrow="Kurumsal"
      title="İş İlanları"
      lede="Güvenlik teknolojilerine ilgi duyan, müşteriye çözüm üretmeyi seven çalışma arkadaşları arıyoruz."
      company={company}
    >
      <h2>Açık pozisyonlar</h2>
      <p>
        Şu an ilan edilmiş açık bir pozisyonumuz bulunmuyor; genel başvurularınızı değerlendiriyoruz. Uygun bir
        pozisyon açıldığında başvurunuza göre sizinle iletişime geçeriz.
      </p>
      <p>İlgilendiğimiz alanlar: satış ve müşteri temsilciliği, teknik destek ve kurulum, depo ve lojistik.</p>

      <h2>Başvuru formu</h2>
      <InquiryForm
        type="kariyer"
        fields={[
          ...CONTACT_FIELDS,
          { name: 'city', label: 'Yaşadığınız il', required: true },
          {
            name: 'position',
            label: 'İlgilendiğiniz alan',
            type: 'select',
            required: true,
            options: ['Satış / müşteri temsilcisi', 'Teknik destek / kurulum', 'Depo ve lojistik', 'Muhasebe / idari işler', 'Diğer'],
          },
          {
            name: 'message',
            label: 'Kendinizi tanıtın',
            type: 'textarea',
            required: true,
            placeholder: 'Eğitim, iş deneyimi ve öne çıkan becerileriniz. Özgeçmişinize bağlantı (LinkedIn vb.) ekleyebilirsiniz.',
          },
        ]}
        submitLabel="Başvuruyu gönder"
        successTitle="Başvurunuz alındı"
        successText="İlginiz için teşekkür ederiz. Uygun bir pozisyon olduğunda sizinle iletişime geçeceğiz."
      />
    </InfoPage>
  );
}
