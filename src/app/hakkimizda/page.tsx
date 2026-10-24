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
