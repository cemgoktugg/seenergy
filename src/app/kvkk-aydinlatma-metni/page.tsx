import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage, SellerBlock } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
};

export default async function KvkkNoticePage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/kvkk-aydinlatma-metni"
      eyebrow="Kişisel veriler"
      title="KVKK Aydınlatma Metni"
      lede="6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, kişisel verilerinizin nasıl işlendiğini açıklıyoruz."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>1. Veri sorumlusu</h2>
      <SellerBlock company={company} />

      <h2>2. İşlenen kişisel veriler</h2>
      <ul>
        <li>
          <strong>Kimlik ve iletişim:</strong> ad, soyad, e-posta adresi, telefon numarası.
        </li>
        <li>
          <strong>Teslimat ve fatura:</strong> adres, il / ilçe, posta kodu; kurumsal faturada firma unvanı, vergi
          dairesi ve vergi / T.C. kimlik numarası.
        </li>
        <li>
          <strong>Müşteri işlemleri:</strong> sipariş, ödeme yöntemi, iade ve talep kayıtları, sipariş notları.
        </li>
        <li>
          <strong>Üyelik:</strong> e-posta adresi ve şifre (şifreniz tarafımızca okunamayacak biçimde, şifrelenmiş
          olarak saklanır).
        </li>
        <li>
          <strong>İşlem güvenliği:</strong> oturum ve sepet çerezleri. Ayrıntılar{' '}
          <Link href="/cerez-politikasi">Çerez Politikası</Link>&apos;ndadır.
        </li>
      </ul>

      <h2>3. İşleme amaçları</h2>
      <ul>
        <li>Siparişinizin alınması, ödemesinin takibi, kargoya verilmesi ve teslim edilmesi,</li>
        <li>Fatura düzenlenmesi ve yasal saklama yükümlülüklerinin yerine getirilmesi,</li>
        <li>İade, değişim, garanti ve şikâyet süreçlerinin yürütülmesi,</li>
        <li>Teklif, toptan satış, bayilik ve iletişim taleplerinize dönüş yapılması,</li>
        <li>Üyelik hesabınızın oluşturulması ve yönetilmesi,</li>
        <li>Bilgi güvenliğinin sağlanması.</li>
      </ul>

      <h2>4. Hukuki sebepler</h2>
      <p>
        Kişisel verileriniz KVKK&apos;nın 5. maddesinin 2. fıkrasındaki; bir sözleşmenin kurulması veya ifasıyla doğrudan
        ilgili olması (c), veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (ç), bir hakkın tesisi,
        kullanılması veya korunması (e) ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri
        sorumlusunun meşru menfaati (f) hukuki sebeplerine dayanılarak işlenir.
      </p>

      <h2>5. Aktarım</h2>
      <p>
        Kişisel verileriniz yalnızca yukarıdaki amaçlarla ve gerekli olduğu ölçüde; teslimat için kargo firmalarına,
        faturalandırma ve muhasebe için hizmet aldığımız taraflara, barındırma ve altyapı hizmeti sağlayıcılarına ve
        talep edilmesi hâlinde yetkili kamu kurum ve kuruluşlarına aktarılabilir.
      </p>

      <h2>6. Toplama yöntemi</h2>
      <p>
        Kişisel verileriniz internet sitemizdeki üyelik, sipariş ve iletişim formları ile çerezler aracılığıyla
        elektronik ortamda toplanır.
      </p>

      <h2>7. Haklarınız</h2>
      <p>KVKK&apos;nın 11. maddesi uyarınca veri sorumlusuna başvurarak:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini, KVKK&apos;daki şartlar çerçevesinde silinmesini isteme,</li>
        <li>Bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
        <li>Otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,</li>
        <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>
      <p>haklarına sahipsiniz.</p>

      <h2>8. Başvuru</h2>
      <p>
        Taleplerinizi yazılı olarak veri sorumlusunun adresine
        {company.kep ? ', KEP adresine' : ''}
        {company.email ? (
          <>
            {' '}veya <a href={`mailto:${company.email}`}>{company.email}</a> adresine
          </>
        ) : null}{' '}
        iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
      </p>
    </InfoPage>
  );
}
