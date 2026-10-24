import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'İade ve Değişim Şartları',
  description: '14 gün cayma hakkı, iade süreci, iade edilemeyen ürünler ve para iadesi.',
};

export default async function ReturnsPage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/iade-degisim"
      eyebrow="Yardım"
      title="İade ve Değişim Şartları"
      lede="Ürünü teslim aldığınız günden itibaren 14 gün içinde, hiçbir gerekçe göstermeden cayma hakkınızı kullanabilirsiniz."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>Cayma hakkı</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, ürünü teslim
        aldığınız tarihten itibaren <strong>14 gün</strong> içinde herhangi bir gerekçe göstermeden ve cezai şart
        ödemeden sözleşmeden cayabilirsiniz.
      </p>

      <h2>İade nasıl yapılır?</h2>
      <ol>
        <li>
          Cayma talebinizi 14 gün içinde{' '}
          {company.email ? (
            <>
              <a href={`mailto:${company.email}`}>{company.email}</a> adresine e-posta ile ya da{' '}
            </>
          ) : null}
          <Link href="/iletisim?konu=iade">iletişim formu</Link> üzerinden, sipariş numaranızla birlikte bize
          bildirin.
        </li>
        <li>Size iletilecek anlaşmalı kargo kodu ile ürünü faturası ve tüm aksesuarlarıyla birlikte gönderin.</li>
        <li>
          Anlaşmalı kargo ile yapılan cayma iadelerinde <strong>kargo ücreti tarafımızca karşılanır</strong>.
        </li>
        <li>Ürün depomuza ulaşıp kontrol edildikten sonra iade işleminiz başlatılır.</li>
      </ol>

      <h2>Para iadesi</h2>
      <p>
        Cayma bildiriminizin bize ulaşmasından itibaren en geç <strong>14 gün</strong> içinde, ödediğiniz tutar
        (gönderim ücreti dâhil) ödeme yönteminize uygun şekilde iade edilir. Havale / EFT ve kapıda ödeme ile yapılan
        alışverişlerde iade, bildireceğiniz IBAN&apos;a yapılır.
      </p>

      <h2>Ürünün durumu</h2>
      <p>
        Cayma süresi içinde ürünü, olağan bir incelemenin gerektirdiği ölçüde kullanabilirsiniz. Ürünün işleyişine,
        teknik özelliklerine ve kullanım talimatlarına aykırı kullanım nedeniyle oluşan değer kaybından tüketici
        sorumludur. Ürünü mümkünse orijinal kutusu, aksesuarları ve kullanım kılavuzuyla birlikte gönderin.
      </p>

      <h2>Cayma hakkının kullanılamadığı durumlar</h2>
      <p>Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca aşağıdaki durumlarda cayma hakkı yoktur:</p>
      <ul>
        <li>Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda özel olarak hazırlanan ürünler,</li>
        <li>
          Teslimden sonra ambalajı, bandı, mührü veya paketi açılmış olan; iadesi sağlık ve hijyen açısından uygun
          olmayan ürünler,
        </li>
        <li>
          Ambalajı tüketici tarafından açılmış olan yazılım, dijital içerik ve bunların sarf malzemeleri (ör. lisans
          anahtarları),
        </li>
        <li>Teslimden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler.</li>
      </ul>

      <h2>Ayıplı (kusurlu) ürün</h2>
      <p>
        Ürün size kusurlu ulaştıysa ya da garanti süresi içinde arızalandıysa cayma süresinden bağımsız olarak yasal
        haklarınız saklıdır: sözleşmeden dönme, bedelde indirim, ücretsiz onarım veya ayıpsız bir misli ile değişim
        haklarından birini seçebilirsiniz. Ayrıntılar <Link href="/garanti">Garanti Koşulları</Link> sayfasındadır.
      </p>

      <h2>Değişim</h2>
      <p>
        Farklı bir model ile değişim isterseniz önce iade sürecini başlatıp yeni ürünü ayrıca sipariş verebilir ya da
        bizimle iletişime geçerek değişimi birlikte planlayabilirsiniz.
      </p>
    </InfoPage>
  );
}
