import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'SEENERGY Güvenlik Teknolojileri: CCTV, kayıt, network, alarm ve geçiş kontrol ürünleri; kendi markamız SEENERGY ve yetkili satıcısı olduğumuz markalar.',
};

export default async function AboutPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/hakkimizda"
      eyebrow="Kurumsal"
      title="Hakkımızda"
      lede="Güvenlik ve elektronik ürünlerinde doğru ürünü, doğru fiyata ve kurulumdan sonra da yanında olan bir ekiple sunuyoruz."
      company={company}
    >
      <h2>Biz kimiz?</h2>
      <p>
        <strong>{company.legalName}</strong>; güvenlik kameraları (CCTV), kayıt cihazları, network ürünleri, yangın
        algılama, alarm, geçiş kontrol, interkom ve seslendirme sistemleri alanında ürün tedarik eden bir teknoloji
        şirketidir. Ev ve iş yerlerinden saha projelerine kadar her ölçekte güvenlik altyapısı için ürün ve çözüm
        sunarız.
      </p>

      {/* The client's own statement (2026-10-27). It stood on the homepage as
          "Firmamız Hakkında" until 2026-10-28, when the client asked for it
          here only. */}
      <h2>Firmamız hakkında</h2>
      <p>
        Zengin dijital deneyimlerle dolu daha iyi bir dünya oluşturma arzumuza katılan tüm dünyadaki topluluklara
        ilham veren teknoloji, ürün ve çözümler konusunda yeniliklere öncülük etme sorumluluğumuzun merkezinde
        bulunmaktadır.
      </p>
      <p>
        Küresel toplumdaki yaratıcı bir firma olma sorumluluğumuzu bilerek çalışanlarımızın ve ortaklarımızın
        paylaştığı değerleri karşılarken ayrıca çaba ve kaynaklarımızı endüstri ve müşterilere yeni değerler sunmaya
        adamış bulunmaktayız. <strong>Seenergy Güvenlik Teknolojileri A.Ş.</strong> olarak hep birlikte heyecan ve
        ümit verici bir gelecek oluşturmak istiyoruz.
      </p>
      <p>
        Operasyonel mükemmellik ve yenilik cesareti sayesinde Türkiye&apos;nin en iyi ürünlerini sunma konusunda
        kendimizle gurur duymaktayız. Seenergy Güvenlik Teknolojileri A.Ş. olarak mevcut başarılarını, rekabet
        gücünü ve kalite konusundaki geçmişini daha ileriye taşıyıp uzman ekiplerimizle üst düzeyde hizmet vermeye
        devam edeceğiz.
      </p>
      <p>Kültürümüzün, iş faaliyetlerimizin ve yönetimimizin parçası olan üç ana stratejik dayanak:</p>
      <ul>
        <li>
          <strong>Yaratıcılık:</strong> teknoloji, ürün ve çözümlerde yeniliklere öncülük etmek.
        </li>
        <li>
          <strong>Ortaklık:</strong> çalışanlarımız ve ortaklarımızla paylaştığımız değerler.
        </li>
        <li>
          <strong>İnsan gücü:</strong> uzman ekiplerimizle üst düzeyde hizmet.
        </li>
      </ul>
      <p>
        <strong>Bugün Türkiye&apos;de, yarın Dünya&apos;da...</strong>
      </p>

      <h2>Markalarımız</h2>
      <p>
        <strong>SEENERGY</strong> tescilli markamızdır: AHD ve IP kameralar, DVR/NVR kayıt cihazları, Wi-Fi ve 4G
        solar kameralardan oluşan ürün gamımızı kendi markamızla sunarız. Bunun yanında Dahua, Hikvision, UNV ve
        Neutron gibi sektörün öncü markalarının ürünlerini de satışa sunarız. Tüm markalara{' '}
        <Link href="/markalar">Markalarımız</Link> sayfasından ulaşabilirsiniz.
      </p>

      <h2>Neler sunuyoruz?</h2>
      <ul>
        <li>
          <strong>Ürün seçiminde teknik destek:</strong> çözünürlük, lens, gece görüşü, kanal sayısı ve disk kapasitesi
          gibi ihtiyaçları sizinle birlikte belirleriz.
        </li>
        <li>
          <strong>Kurumsal ve proje satışları:</strong> çok kameralı projeler, site ve fabrika kurulumları için ürün
          listesi ve fiyat teklifi hazırlarız. <Link href="/kurumsal">Teklif isteyin</Link>.
        </li>
        <li>
          <strong>Toptan satış ve bayilik:</strong> kurulum firmaları ve satıcılar için toptan fiyat ve bayilik
          imkânı. <Link href="/bayi-basvurusu">Bayi başvurusu</Link>.
        </li>
        <li>
          <strong>Faturalı, garantili ürün:</strong> tüm ürünler faturalı ve yasal garanti kapsamında satılır.
        </li>
      </ul>

      <h2>Alışveriş güvencesi</h2>
      <p>
        Siparişlerinizi havale / EFT ya da kapıda ödeme ile verebilirsiniz. 1.000 TL ve üzeri siparişlerde kargo
        ücretsizdir. Teslimattan itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz; ayrıntılar{' '}
        <Link href="/iade-degisim">İade ve Değişim</Link> sayfasındadır.
      </p>
    </InfoPage>
  );
}
