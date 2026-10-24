import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage, SellerBlock } from '@/components/info-page';
import { formatPrice, FREE_SHIPPING_FROM } from '@/data/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Ön Bilgilendirme Formu',
  description: 'Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş öncesi bilgilendirme.',
};

export default async function PreInformationPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/on-bilgilendirme-formu"
      eyebrow="Sözleşmeler"
      title="Ön Bilgilendirme Formu"
      lede="Mesafeli Sözleşmeler Yönetmeliği'nin 5. maddesi uyarınca, siparişinizi vermeden önce bilmeniz gerekenler."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>1. Satıcı bilgileri</h2>
      <SellerBlock company={company} />

      <h2>2. Ürünün temel nitelikleri ve fiyatı</h2>
      <p>
        Ürünün temel nitelikleri (marka, model, teknik özellikler) ilgili ürün sayfasında; vergiler dâhil toplam
        satış fiyatı, kargo ücreti ve ödenecek toplam tutar ödeme sayfasındaki sipariş özetinde gösterilir. Fiyatlara
        KDV dâhildir.
      </p>

      <h2>3. Ödeme ve teslimat</h2>
      <ul>
        <li>
          <strong>Ödeme yöntemleri:</strong> Havale / EFT ve kapıda ödeme.
        </li>
        <li>
          <strong>Kargo:</strong> Standart kargo {formatPrice(99.9)} ({formatPrice(FREE_SHIPPING_FROM)} ve üzeri
          ücretsiz), hızlı kargo {formatPrice(149.9)}.
        </li>
        <li>
          <strong>Teslim süresi:</strong> Ürün, kargo seçeneğine göre belirtilen sürede kargoya verilir; teslim süresi
          yasal 30 günü aşamaz. Havale / EFT siparişleri ödeme ulaştıktan sonra gönderilir.
        </li>
      </ul>

      <h2>4. Cayma hakkı</h2>
      <p>
        Ürünü teslim aldığınız tarihten itibaren <strong>14 gün</strong> içinde gerekçe göstermeksizin ve cezai şart
        ödemeksizin sözleşmeden cayabilirsiniz. Cayma bildirimini e-posta veya{' '}
        <Link href="/iletisim?konu=iade">iletişim formu</Link> ile yapabilirsiniz. Anlaşmalı kargo ile yapılan
        iadelerde kargo ücreti satıcıya aittir; ödediğiniz tutar, cayma bildiriminin satıcıya ulaşmasından itibaren 14
        gün içinde iade edilir.
      </p>
      <p>
        Cayma hakkının kullanılamayacağı durumlar <Link href="/iade-degisim">İade ve Değişim Şartları</Link>{' '}
        sayfasında listelenmiştir.
      </p>

      <h2>5. Şikâyet ve itirazlar</h2>
      <p>
        Şikâyetlerinizi satıcıya yukarıdaki iletişim bilgilerinden iletebilirsiniz. Uyuşmazlıklarda, Ticaret
        Bakanlığınca ilan edilen parasal sınırlar dâhilinde Tüketici Hakem Heyetlerine, bu sınırların üzerinde
        Tüketici Mahkemelerine başvurabilirsiniz.
      </p>

      <h2>6. Sözleşme</h2>
      <p>
        Siparişinize ilişkin hak ve yükümlülükler <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış
        Sözleşmesi</Link>&apos;nde yer alır. Ödeme sayfasında bu formu ve sözleşmeyi onaylayarak siparişinizi
        tamamlarsınız.
      </p>
    </InfoPage>
  );
}
