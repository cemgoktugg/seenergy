import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Referanslarımız',
  description:
    'SEENERGY Güvenlik Teknolojileri; fabrika, site, mağaza, okul, sağlık ve otopark projelerinde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlar.',
};

/**
 * The sectors the shop supplies, not a list of client names: those are shared
 * during a quote, with the clients' consent, rather than published here.
 */
export default async function ReferencesPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/referanslar"
      eyebrow="Kurumsal"
      title="Referanslarımız"
      lede="Farklı sektörlerde güvenlik altyapısı kuran firmalara, kurulumculara ve proje ekiplerine ürün ve çözüm sağlıyoruz."
      company={company}
    >
      <h2>Hizmet verdiğimiz alanlar</h2>
      <ul>
        <li>
          <strong>Fabrika ve depo:</strong> geniş alan ve çevre güvenliği, giriş-çıkış kontrolü, gece görüşlü
          kamera ve uzun süreli kayıt.
        </li>
        <li>
          <strong>Site ve konut:</strong> ortak alan, otopark ve giriş kameraları, interkom ve geçiş kontrol
          sistemleri.
        </li>
        <li>
          <strong>Mağaza ve AVM:</strong> kasa ve satış alanı izleme, renkli gece görüşü, uzaktan izleme.
        </li>
        <li>
          <strong>Okul ve kamu binaları:</strong> bina çevresi, koridor ve giriş güvenliği, yangın algılama.
        </li>
        <li>
          <strong>Sağlık:</strong> kesintisiz kayıt, network altyapısı ve alarm sistemleri.
        </li>
        <li>
          <strong>Otopark ve uzak saha:</strong> plaka ve araç izleme, elektrik ve internet hattı olmayan
          noktalar için 4G solar kameralar.
        </li>
      </ul>

      <h2>Referans listemiz</h2>
      <p>
        Tamamladığımız projelerin ve çalıştığımız firmaların listesini, müşterilerimizin onayıyla, teklif
        sürecinde paylaşıyoruz. Benzer bir proje için örnek ve referans talep etmek isterseniz{' '}
        <Link href="/kurumsal">kurumsal satış ve proje</Link> formundan bize yazabilirsiniz.
      </p>

      <h2>Birlikte çalıştığımız markalar</h2>
      <p>
        Kendi markamız SEENERGY&apos;nin yanında Dahua, Hikvision, UNV ve Neutron gibi markaların ürünlerini
        sunuyoruz. Tüm markalar için <Link href="/cozum-ortaklarimiz">Çözüm Ortaklarımız</Link> sayfasına göz
        atabilirsiniz.
      </p>
    </InfoPage>
  );
}
