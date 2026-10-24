import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { formatPrice, FREE_SHIPPING_FROM } from '@/data/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Kargo ve Teslimat',
  description: `Kargo seçenekleri, ücretleri ve teslimat süreleri. ${FREE_SHIPPING_FROM.toLocaleString('tr-TR')} TL ve üzeri siparişlerde kargo ücretsiz.`,
};

/* The figures match the Medusa shipping options the seed created
   (initial-data-seed.ts): Standart 99,90 TL, free from 1.000 TL; Hızlı
   149,90 TL. If they are changed in the admin, change them here too. */
export default async function ShippingPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/kargo-teslimat"
      eyebrow="Yardım"
      title="Kargo ve Teslimat"
      lede={`${formatPrice(FREE_SHIPPING_FROM)} ve üzeri siparişlerde standart kargo ücretsizdir. Siparişleriniz Türkiye'nin her yerine gönderilir.`}
      company={company}
    >
      <h2>Kargo seçenekleri</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Seçenek</th>
            <th scope="col">Ücret</th>
            <th scope="col">Kargoya teslim</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Standart Kargo</strong>
            </td>
            <td>
              {formatPrice(99.9)} · {formatPrice(FREE_SHIPPING_FROM)} ve üzeri ücretsiz
            </td>
            <td>1–3 iş günü içinde</td>
          </tr>
          <tr>
            <td>
              <strong>Hızlı Kargo</strong>
            </td>
            <td>{formatPrice(149.9)}</td>
            <td>Saat 15:00&apos;e kadar verilen siparişler aynı gün</td>
          </tr>
        </tbody>
      </table>
      <p>Kargo ücreti ödeme sayfasında, siparişi onaylamadan önce toplam tutara eklenmiş olarak gösterilir.</p>

      <h2>Ne zaman kargoya verilir?</h2>
      <ul>
        <li>
          <strong>Kapıda ödeme:</strong> sipariş onaylandıktan sonra yukarıdaki sürelerde kargoya verilir.
        </li>
        <li>
          <strong>Havale / EFT:</strong> ödemeniz hesabımıza ulaştıktan sonra kargoya verilir. Ödemenizi hızlandırmak
          için <Link href="/havale-bildirim">Havale Bildirim Formu</Link>&apos;nu doldurabilirsiniz.
        </li>
        <li>Hafta sonu ve resmî tatillerde verilen siparişler ilk iş günü işleme alınır.</li>
      </ul>
      <p>
        Kargoya verildikten sonra teslimat genellikle 1–3 iş günü sürer; teslimat süresi bulunduğunuz bölgeye ve kargo
        firmasının yoğunluğuna göre değişebilir. Yasal azami teslim süresi 30 gündür.
      </p>

      <h2>Siparişimi nasıl takip ederim?</h2>
      <p>
        <Link href="/siparis-takibi">Sipariş Takibi</Link> sayfasından sipariş numaranız ve e-posta adresinizle
        siparişinizin durumunu görebilirsiniz. Üyeyseniz <Link href="/hesabim">Hesabım</Link> sayfasında tüm
        siparişleriniz listelenir.
      </p>

      <h2>Teslim alırken</h2>
      <ul>
        <li>Paketi kargo görevlisinin yanında kontrol edin.</li>
        <li>
          Pakette ezilme, ıslanma, yırtılma gibi bir hasar varsa paketi teslim almadan kargo görevlisine{' '}
          <strong>hasar tespit tutanağı</strong> düzenletin ve bize bildirin.
        </li>
        <li>Tutanaksız teslim alınan hasarlı paketlerde kargo firmasına başvuru güçleşir.</li>
      </ul>
    </InfoPage>
  );
}
