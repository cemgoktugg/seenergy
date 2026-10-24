import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: 'Sitemizde kullanılan çerezler ve tarayıcı depolama kayıtları.',
};

/* Exactly what the site sets, as of 2026-10-24 — keep in step with the code:
   cookies   seenergy_cart  (src/lib/medusa/cart-cookie.ts)
             seenergy_auth  (src/lib/medusa/session.ts)
   storage   seenergy-theme (theme-toggle.tsx), seenergy.store.v1 (cart-store.tsx)
   No analytics, advertising or third-party cookies. */
export default async function CookiePage() {
  const { company } = await loadVitrin();
  return (
    <InfoPage
      path="/cerez-politikasi"
      eyebrow="Kişisel veriler"
      title="Çerez Politikası"
      lede="Sitemizde yalnızca sitenin çalışması için zorunlu çerezler kullanılır. Analiz, reklam veya üçüncü taraf takip çerezi kullanılmaz."
      updated="24 Ekim 2026"
      company={company}
    >
      <h2>Çerez nedir?</h2>
      <p>
        Çerezler, ziyaret ettiğiniz internet sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Sepetinizin
        hatırlanması veya oturumunuzun açık kalması gibi temel işlevler için kullanılır.
      </p>

      <h2>Kullandığımız çerezler</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Ad</th>
            <th scope="col">Amaç ve süre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>seenergy_cart</code>
            </td>
            <td>Sepetinizi hatırlar. Zorunlu çerezdir; sepet tamamlandığında veya süresi dolduğunda silinir.</td>
          </tr>
          <tr>
            <td>
              <code>seenergy_auth</code>
            </td>
            <td>Üye girişi yaptığınızda oturumunuzu açık tutar. Zorunlu çerezdir; 24 saat sonra veya çıkış yaptığınızda silinir.</td>
          </tr>
        </tbody>
      </table>

      <h2>Tarayıcı depolaması</h2>
      <p>Aşağıdaki tercihler yalnızca kendi tarayıcınızda saklanır ve bize gönderilmez:</p>
      <ul>
        <li>
          <strong>Tema tercihi</strong> (açık / koyu görünüm).
        </li>
        <li>
          <strong>Favoriler ve karşılaştırma listesi.</strong>
        </li>
      </ul>

      <h2>Çerezleri yönetme</h2>
      <p>
        Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemeniz
        hâlinde sepet ve üye girişi gibi işlevler çalışmaz.
      </p>
      <p>
        Kişisel verilerinizin işlenmesi hakkında ayrıntılı bilgi için{' '}
        <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;ni inceleyebilirsiniz.
      </p>
    </InfoPage>
  );
}
