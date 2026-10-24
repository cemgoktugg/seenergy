import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { formatPrice, FREE_SHIPPING_FROM } from '@/data/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'Sipariş, ödeme, kargo, iade, garanti, fatura ve teklif hakkında sık sorulan sorular.',
};

const GROUPS: { title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    title: 'Sipariş ve ödeme',
    items: [
      {
        q: 'Hangi ödeme yöntemlerini kullanabilirim?',
        a: (
          <p>
            Havale / EFT ve kapıda ödeme ile sipariş verebilirsiniz. Havale / EFT siparişlerinde banka bilgilerimiz
            sipariş onay sayfasında gösterilir; ödemeniz ulaştığında siparişiniz kargoya verilir.
          </p>
        ),
      },
      {
        q: 'Üye olmadan sipariş verebilir miyim?',
        a: (
          <p>
            Evet. Ödeme sayfasında e-posta ve adres bilgilerinizi girmeniz yeterli. Üye olursanız siparişlerinizi ve
            adreslerinizi <Link href="/hesabim">Hesabım</Link> sayfasından yönetebilirsiniz.
          </p>
        ),
      },
      {
        q: 'Havale yaptım, ne yapmalıyım?',
        a: (
          <p>
            Açıklama kısmına sipariş numaranızı yazmanız yeterli. Siparişinizin hızlı eşleşmesi için{' '}
            <Link href="/havale-bildirim">Havale Bildirim Formu</Link>&apos;nu da doldurabilirsiniz.
          </p>
        ),
      },
      {
        q: 'Bazı ürünlerde fiyat yerine “Fiyat için teklif isteyin” yazıyor. Neden?',
        a: (
          <p>
            Bu ürünlerin fiyatı adet, proje kapsamı ve stok durumuna göre belirlenir. Ürün sayfasındaki{' '}
            <strong>Fiyat Teklifi Al</strong> düğmesiyle talebinizi iletin; size en kısa sürede dönüş yapalım.
          </p>
        ),
      },
      {
        q: 'Kurumsal fatura alabilir miyim?',
        a: (
          <p>
            Evet. Ödeme sayfasında fatura tipini <strong>Kurumsal</strong> seçip firma unvanı, vergi dairesi ve vergi
            numarasını girmeniz yeterli.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Kargo ve teslimat',
    items: [
      {
        q: 'Kargo ücreti ne kadar?',
        a: (
          <p>
            Standart kargo {formatPrice(99.9)}, {formatPrice(FREE_SHIPPING_FROM)} ve üzeri siparişlerde ücretsizdir.
            Hızlı kargo {formatPrice(149.9)}&apos;dur. Ayrıntılar <Link href="/kargo-teslimat">Kargo ve Teslimat</Link>{' '}
            sayfasında.
          </p>
        ),
      },
      {
        q: 'Siparişim ne zaman kargoya verilir?',
        a: (
          <p>
            Standart kargoda 1–3 iş günü içinde; hızlı kargoda saat 15:00&apos;e kadar verilen siparişler aynı gün kargoya
            verilir. Havale / EFT siparişleri ödeme ulaştıktan sonra gönderilir.
          </p>
        ),
      },
      {
        q: 'Siparişimi nasıl takip ederim?',
        a: (
          <p>
            <Link href="/siparis-takibi">Sipariş Takibi</Link> sayfasında sipariş numaranız ve e-posta adresinizle
            siparişinizin durumunu görebilirsiniz.
          </p>
        ),
      },
    ],
  },
  {
    title: 'İade, değişim ve garanti',
    items: [
      {
        q: 'Ürünü iade edebilir miyim?',
        a: (
          <p>
            Teslimattan itibaren 14 gün içinde gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Anlaşmalı kargo
            ile yapılan iadelerde kargo ücreti bize aittir. Ayrıntılar{' '}
            <Link href="/iade-degisim">İade ve Değişim</Link> sayfasında.
          </p>
        ),
      },
      {
        q: 'Ürünlerin garanti süresi ne kadar?',
        a: (
          <p>
            Tüm ürünler faturalı ve en az 2 yıl yasal garantilidir. Arıza durumunda{' '}
            <Link href="/garanti">Garanti Koşulları</Link> sayfasındaki adımları izleyin.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Ürünler ve teknik destek',
    items: [
      {
        q: 'Hangi kamerayı veya kayıt cihazını seçmeliyim?',
        a: (
          <p>
            AHD kameralar koaksiyel kablo ve DVR ile, IP kameralar ağ kablosu ve NVR ile çalışır. Kamera sayısı,
            gece görüşü mesafesi ve kayıt süresine göre birlikte seçim yapabiliriz;{' '}
            <Link href="/iletisim?konu=teknik">teknik destek</Link> talebi bırakın.
          </p>
        ),
      },
      {
        q: 'Ürünlerin teknik belgelerine nereden ulaşırım?',
        a: <p>SEENERGY ürün sayfalarındaki “Teknik föy (PDF)” bağlantısından üreticinin teknik özellik belgesini indirebilirsiniz.</p>,
      },
      {
        q: 'Toptan alım veya bayilik için ne yapmalıyım?',
        a: (
          <p>
            <Link href="/toptan-satis">Toptan Satış</Link> veya <Link href="/bayi-basvurusu">Bayi Başvurusu</Link>{' '}
            formunu doldurun; satış ekibimiz sizinle iletişime geçer.
          </p>
        ),
      },
    ],
  },
];

export default async function FaqPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/sss"
      eyebrow="Yardım"
      title="Sıkça Sorulan Sorular"
      lede="Aradığınız yanıtı bulamazsanız bize yazın; mesai saatlerinde aynı gün dönüş yapıyoruz."
      company={company}
    >
      {GROUPS.map((group) => (
        <section key={group.title} className="faq-group">
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}
        </section>
      ))}
    </InfoPage>
  );
}
