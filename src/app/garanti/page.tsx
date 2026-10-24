import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Garanti Koşulları',
  description: 'Yasal garanti süresi, arızalı ürün başvurusu ve garanti kapsamı dışındaki durumlar.',
};

export default async function WarrantyPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/garanti"
      eyebrow="Yardım"
      title="Garanti Koşulları"
      lede="Sattığımız tüm ürünler faturalıdır ve teslim tarihinden itibaren en az 2 yıl yasal garanti kapsamındadır."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>Garanti süresi</h2>
      <p>
        6502 sayılı Kanun ve Garanti Belgesi Yönetmeliği uyarınca ürünler, teslim tarihinden itibaren{' '}
        <strong>en az 2 yıl</strong> garantilidir. Üreticinin daha uzun garanti verdiği ürünlerde bu süre ürün
        sayfasında ya da garanti belgesinde belirtilir. Garanti süresi faturanızdaki tarihten başlar; faturanızı
        saklayın.
      </p>

      <h2>Arızalı ürün başvurusu</h2>
      <ol>
        <li>
          Arızayı <Link href="/iletisim?konu=garanti">iletişim formu</Link> ile, sipariş numarası ve arızanın kısa
          açıklamasıyla bize bildirin. Mümkünse bir fotoğraf ya da video ekleyin.
        </li>
        <li>Teknik ekibimiz önce uzaktan kontrol önerir; birçok ayar ve bağlantı sorunu bu adımda çözülür.</li>
        <li>Çözülemezse size iletilen anlaşmalı kargo kodu ile ürünü gönderirsiniz.</li>
        <li>
          Ürün, yetkili servis tarafından incelenir. Azami tamir süresi 20 iş günüdür; bu süre içinde onarılamayan
          ürünler için değişim veya bedel iadesi seçeneklerinden birini kullanabilirsiniz.
        </li>
      </ol>

      <h2>Garanti kapsamı dışındaki durumlar</h2>
      <ul>
        <li>Kullanım kılavuzuna aykırı kullanım, yanlış kurulum veya hatalı besleme (voltaj) kaynaklı arızalar,</li>
        <li>Düşme, çarpma, sıvı teması, yıldırım ve yangın gibi dış etkenlerden kaynaklanan hasarlar,</li>
        <li>Yetkisiz kişilerce açılmış, onarılmış veya üzerinde değişiklik yapılmış ürünler,</li>
        <li>Seri numarası, garanti etiketi veya fatura bilgisi okunamayan ürünler,</li>
        <li>Pil, batarya ve kablo gibi sarf niteliğindeki parçaların olağan aşınması.</li>
      </ul>

      <h2>Kurulum ve ayar desteği</h2>
      <p>
        Kayıt cihazı, kamera ve uzaktan izleme uygulaması kurulumunda sorun yaşarsanız garanti başvurusu yapmadan önce
        bize ulaşın; ürün kodunu (SKU) belirtmeniz yeterlidir. Ürün sayfalarındaki <strong>Teknik föy (PDF)</strong>{' '}
        bağlantısında üreticinin teknik özellik belgesini bulabilirsiniz.
      </p>
    </InfoPage>
  );
}
