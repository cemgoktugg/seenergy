import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Projelerimiz',
  description:
    'Kamera, kayıt, network ve uzak saha (4G, solar) güvenlik projeleri: keşiften kuruluma kadar ürün ve çözüm desteği.',
};

/** The kinds of project the shop supplies and how a project runs with it. */
export default async function ProjectsPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/projeler"
      eyebrow="Kurumsal"
      title="Projelerimiz"
      lede="Tek bir kameradan yüzlerce kanallı kayıt sistemine kadar, projenize uygun ürünleri seçiyor ve proje boyunca yanınızda oluyoruz."
      company={company}
    >
      <h2>Proje türleri</h2>
      <ul>
        <li>
          <strong>CCTV ve kayıt sistemleri:</strong> AHD ve IP kameralar, DVR/NVR kayıt cihazları, disk ve
          depolama planlaması.
        </li>
        <li>
          <strong>Network altyapısı:</strong> PoE ve ethernet switch, access point, router ve rack kabinet.
        </li>
        <li>
          <strong>Uzak saha:</strong> elektrik ve internet hattı olmayan noktalar için 4G SIM kartlı, solar
          panelli kameralar.
        </li>
        <li>
          <strong>Alarm, yangın ve geçiş kontrol:</strong> bina güvenliğini tamamlayan sistemler.
        </li>
      </ul>

      <h2>Bir proje nasıl ilerler?</h2>
      <ol>
        <li>
          <strong>İhtiyacı konuşuruz:</strong> alanı, kamera noktalarını, kayıt süresini ve bütçeyi birlikte
          belirleriz.
        </li>
        <li>
          <strong>Teklif hazırlarız:</strong> uyumlu ürünleri, adetleri ve fiyatları tek bir teklifte sunarız.
        </li>
        <li>
          <strong>Tedarik ederiz:</strong> ürünleri faturalı ve garantili olarak hızla sevk ederiz.
        </li>
        <li>
          <strong>Kurulumda destek oluruz:</strong> kurulum ve ayar aşamasında teknik destek veririz.
        </li>
      </ol>

      <h2>Projeniz için teklif alın</h2>
      <p>
        Proje detaylarını <Link href="/kurumsal">kurumsal satış ve proje</Link> formundan iletin; size aynı gün
        dönüş yapalım. Daha önce yaptığımız benzer projeler için <Link href="/referanslar">Referanslarımız</Link>{' '}
        sayfasına göz atabilirsiniz.
      </p>
    </InfoPage>
  );
}
