import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Kişisel Verilerin Korunması',
  description: 'Kişisel verilerin korunması ve işlenmesi politikamız.',
};

export default async function KvkkPolicyPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/kvkk"
      eyebrow="Kişisel veriler"
      title="Kişisel Verilerin Korunması Politikası"
      lede="Kişisel verilerinizi yalnızca gerektiği kadar, belirli amaçlarla ve güvenli biçimde işleriz."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>İlkelerimiz</h2>
      <p>
        {company.legalName}, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 4. maddesindeki genel ilkelere uygun
        olarak kişisel verileri:
      </p>
      <ul>
        <li>Hukuka ve dürüstlük kurallarına uygun,</li>
        <li>Doğru ve gerektiğinde güncel,</li>
        <li>Belirli, açık ve meşru amaçlar için,</li>
        <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü,</li>
        <li>İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza ederek</li>
      </ul>
      <p>işler.</p>

      <h2>Saklama ve imha</h2>
      <p>
        Kişisel veriler, işlendikleri amacın gerektirdiği ve mevzuatta öngörülen süreler (ör. fatura ve muhasebe
        kayıtları için vergi mevzuatındaki süreler) boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim
        hâle getirilir.
      </p>

      <h2>Güvenlik</h2>
      <ul>
        <li>Siteye erişim şifreli bağlantı (HTTPS) üzerinden sağlanır.</li>
        <li>Üyelik şifreleri okunamayacak biçimde şifrelenerek saklanır.</li>
        <li>Kart bilgisi alınmaz ve saklanmaz; ödemeler havale / EFT veya kapıda ödeme ile yapılır.</li>
        <li>Verilere erişim, görevi gereği ihtiyacı olan personelle sınırlıdır.</li>
      </ul>

      <h2>Ayrıntılı bilgi ve başvuru</h2>
      <p>
        Hangi verilerin, hangi amaçlarla işlendiği, kimlere aktarıldığı ve haklarınızı nasıl kullanacağınız{' '}
        <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;nde açıklanmıştır.
      </p>
    </InfoPage>
  );
}
