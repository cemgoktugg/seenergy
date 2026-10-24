import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage, SellerBlock } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description: 'Satıcı ve alıcı arasındaki mesafeli satış sözleşmesinin koşulları.',
};

/**
 * The contract the checkout's agreement box links to. The seller block reads
 * admin → Vitrin → Şirket bilgileri; the order's own particulars (products,
 * prices, address) are those shown on the checkout summary and the order
 * confirmation, which this text refers to.
 */
export default async function DistanceSalesPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/mesafeli-satis-sozlesmesi"
      eyebrow="Sözleşmeler"
      title="Mesafeli Satış Sözleşmesi"
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>1. Taraflar</h2>
      <h3>Satıcı</h3>
      <SellerBlock company={company} />
      <h3>Alıcı</h3>
      <p>
        Ödeme sayfasında adı, soyadı, e-posta adresi, telefonu ve teslimat / fatura adresi girilen kişi
        (&quot;ALICI&quot;). Alıcının bilgileri sipariş özetinde ve sipariş onay sayfasında yer alır.
      </p>

      <h2>2. Konu</h2>
      <p>
        Bu sözleşmenin konusu, ALICI&apos;nın SATICI&apos;ya ait internet sitesi üzerinden elektronik ortamda sipariş
        verdiği, nitelikleri ve satış fiyatı sipariş özetinde belirtilen ürünlerin satışı ve teslimine ilişkin olarak
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince
        tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h2>3. Sözleşme konusu ürün, ödeme ve teslimat</h2>
      <p>
        Ürünlerin türü, miktarı, marka / modeli, vergiler dâhil satış fiyatı, kargo ücreti, ödeme yöntemi ve teslimat
        adresi sipariş özetinde ve sipariş onay sayfasında belirtildiği gibidir. Ürün fiyatlarına KDV dâhildir.
      </p>
      <ul>
        <li>
          <strong>Ödeme:</strong> Havale / EFT veya kapıda ödeme. Havale / EFT siparişlerinde ürün, ödemenin
          SATICI hesabına ulaşmasından sonra kargoya verilir.
        </li>
        <li>
          <strong>Teslimat:</strong> Ürün, ALICI&apos;nın bildirdiği adrese kargo ile gönderilir. Teslim süresi sipariş
          tarihinden itibaren yasal 30 günlük süreyi aşamaz. Kargo seçenekleri ve ücretleri{' '}
          <Link href="/kargo-teslimat">Kargo ve Teslimat</Link> sayfasındadır.
        </li>
      </ul>

      <h2>4. Genel hükümler</h2>
      <ol>
        <li>
          ALICI, sözleşme konusu ürünün temel nitelikleri, satış fiyatı, ödeme şekli ve teslimata ilişkin ön
          bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini kabul eder.
        </li>
        <li>
          Ürün, ALICI&apos;dan başka bir kişiye teslim edilecekse, teslim edilecek kişinin teslimatı kabul etmemesinden
          SATICI sorumlu tutulamaz.
        </li>
        <li>
          SATICI, ürünü sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgesi ve kullanım
          kılavuzu ile teslim etmekle yükümlüdür.
        </li>
        <li>
          Ürünün teslimi için ödemenin yapılmış olması (havale / EFT) ya da teslimatta yapılacak olması (kapıda
          ödeme) gerekir.
        </li>
        <li>
          SATICI, sipariş konusu ürünün tedarikinin imkânsızlaşması hâlinde bu durumu öğrendiği tarihten itibaren 3
          gün içinde ALICI&apos;ya bildirir ve tahsil edilen tutarı 14 gün içinde iade eder.
        </li>
      </ol>

      <h2>5. Cayma hakkı</h2>
      <p>
        ALICI, ürünün kendisine veya gösterdiği kişiye tesliminden itibaren <strong>14 gün</strong> içinde
        herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma
        bildirimi SATICI&apos;ya yazılı olarak veya kalıcı veri saklayıcısı ile (e-posta) yapılır.
      </p>
      <ul>
        <li>
          Cayma hakkının kullanılmasıyla SATICI, cayma bildiriminin kendisine ulaştığı tarihten itibaren en geç 14 gün
          içinde, varsa teslim masrafları dâhil tahsil edilen tüm ödemeleri iade eder.
        </li>
        <li>
          ALICI, cayma bildirimini izleyen 10 gün içinde ürünü SATICI&apos;ya geri gönderir. SATICI&apos;nın belirttiği
          anlaşmalı kargo ile yapılan iadelerde iade masrafı SATICI&apos;ya aittir.
        </li>
        <li>
          ALICI, cayma süresi içinde ürünün işleyişine, teknik özelliklerine ve kullanım talimatlarına uygun
          kullanılması dışındaki kullanımlardan kaynaklanan değişiklik ve bozulmalardan sorumludur.
        </li>
      </ul>
      <p>
        Cayma hakkının kullanılamayacağı ürünler ve iade sürecinin ayrıntıları{' '}
        <Link href="/iade-degisim">İade ve Değişim Şartları</Link> sayfasında yer alır.
      </p>

      <h2>6. Garanti ve ayıplı mal</h2>
      <p>
        Ürünler en az 2 yıl yasal garanti kapsamındadır. Ayıplı ürünlerde ALICI, 6502 sayılı Kanun&apos;un 11. maddesinde
        yer alan sözleşmeden dönme, satış bedelinden indirim isteme, ücretsiz onarım isteme veya ayıpsız misli ile
        değiştirilmesini isteme seçimlik haklarından birini kullanabilir. Ayrıntılar{' '}
        <Link href="/garanti">Garanti Koşulları</Link> sayfasındadır.
      </p>

      <h2>7. Kişisel veriler</h2>
      <p>
        ALICI&apos;nın kişisel verileri, siparişin ifası amacıyla 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;na uygun
        olarak işlenir. Ayrıntılar <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;ndedir.
      </p>

      <h2>8. Uyuşmazlıkların çözümü</h2>
      <p>
        Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca her yıl ilan edilen parasal sınırlar dâhilinde
        ALICI&apos;nın veya SATICI&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri, bu sınırların üzerindeki
        uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir. ALICI, şikâyetlerini SATICI&apos;ya yukarıdaki iletişim bilgileri
        üzerinden de iletebilir.
      </p>

      <h2>9. Yürürlük</h2>
      <p>
        ALICI, ödeme sayfasında bu sözleşmeyi onaylayıp siparişi tamamladığında sözleşmenin tüm koşullarını kabul
        etmiş sayılır. Sözleşme, siparişin tamamlandığı tarihte yürürlüğe girer.
      </p>
    </InfoPage>
  );
}
