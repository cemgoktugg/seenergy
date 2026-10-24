import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Gizlilik ve Güvenlik',
  description: 'Alışveriş güvenliği, ödeme güvenliği ve bilgilerinizin korunması.',
};

export default async function PrivacyPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/gizlilik"
      eyebrow="Güvenlik"
      title="Gizlilik ve Güvenlik"
      lede="Alışverişinizin ve bilgilerinizin güvenliği için aldığımız önlemler."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>Güvenli bağlantı</h2>
      <p>
        Sitemizin tüm sayfaları şifreli bağlantı (SSL / HTTPS) üzerinden sunulur. Formlara girdiğiniz bilgiler
        tarayıcınızla sunucumuz arasında şifrelenerek iletilir.
      </p>

      <h2>Ödeme güvenliği</h2>
      <p>
        Sitemizde kredi kartı bilgisi alınmaz ve saklanmaz. Ödemeler havale / EFT ile doğrudan banka hesabımıza ya da
        teslimat sırasında kargo görevlisine yapılır. Bizden geldiğini iddia eden ve kart bilgisi isteyen e-posta veya
        mesajlara itibar etmeyin; havale yapacağınız hesap yalnızca sipariş onay sayfanızda gösterilen hesaptır.
      </p>

      <h2>Üyelik güvenliği</h2>
      <ul>
        <li>Şifreniz okunamayacak biçimde şifrelenerek saklanır; çalışanlarımız dâhil kimse şifrenizi göremez.</li>
        <li>Oturumunuz 24 saat sonra kendiliğinden kapanır. Ortak kullanılan cihazlarda çıkış yapmayı unutmayın.</li>
        <li>Güçlü ve başka sitelerde kullanmadığınız bir şifre seçin.</li>
      </ul>

      <h2>Bilgilerinizin kullanımı</h2>
      <p>
        Bilgileriniz yalnızca siparişinizin tamamlanması, faturalandırma ve taleplerinize dönüş için kullanılır;
        izniniz olmadan pazarlama amacıyla kullanılmaz ve üçüncü kişilere satılmaz. Ayrıntılar{' '}
        <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link> ve{' '}
        <Link href="/cerez-politikasi">Çerez Politikası</Link>&apos;ndadır.
      </p>
    </InfoPage>
  );
}
