import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'İnternet sitemizin kullanım koşulları.',
};

export default async function TermsPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/kullanim-kosullari"
      eyebrow="Sözleşmeler"
      title="Kullanım Koşulları"
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>1. Kapsam</h2>
      <p>
        Bu internet sitesi {company.legalName} tarafından işletilmektedir. Siteyi kullanan herkes bu koşulları kabul
        etmiş sayılır.
      </p>

      <h2>2. İçerik ve fiyatlar</h2>
      <ul>
        <li>
          Ürün görselleri, açıklamaları ve teknik özellikleri bilgilendirme amaçlıdır; üretici tarafından önceden haber
          verilmeksizin değiştirilebilir. Teknik bir ayrıntı satın alma kararınız için belirleyiciyse siparişten önce
          bize teyit ettirin.
        </li>
        <li>
          Fiyatlar ve stok durumu önceden haber verilmeksizin değişebilir. Siparişiniz, ödeme sayfasında onayladığınız
          fiyat üzerinden alınır.
        </li>
        <li>
          Açık bir yazım veya sistem hatası nedeniyle gerçek değerinin çok altında gösterilen fiyatlarla verilen
          siparişler için bilgilendirme yapılarak sipariş iptal edilebilir ve ödeme iade edilir.
        </li>
      </ul>

      <h2>3. Üyelik</h2>
      <p>
        Üyelik bilgilerinizin doğru ve güncel olmasından ve şifrenizin gizliliğinden siz sorumlusunuz. Hesabınızda
        yetkisiz bir işlem fark ederseniz bize hemen bildirin.
      </p>

      <h2>4. Fikrî haklar</h2>
      <p>
        Sitedeki tasarım, metin, logo ve görsellerin hakları {company.legalName}&apos;ye veya ilgili hak sahiplerine
        aittir. Marka adları ve logoları sahiplerinin tescilli markalarıdır. İzinsiz kopyalanamaz ve
        çoğaltılamaz.
      </p>

      <h2>5. Kullanım kuralları</h2>
      <p>
        Siteyi hukuka aykırı amaçlarla kullanmak, otomatik araçlarla aşırı yük oluşturmak veya sistemlerin güvenliğini
        aşmaya çalışmak yasaktır.
      </p>

      <h2>6. Satış koşulları</h2>
      <p>
        Siparişlere <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link> ve{' '}
        <Link href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</Link> uygulanır.
      </p>

      <h2>7. Değişiklikler</h2>
      <p>Bu koşullar güncellenebilir; güncel metin her zaman bu sayfada yayımlanır.</p>
    </InfoPage>
  );
}
