import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, LogIn } from 'lucide-react';

import { InfoPage } from '@/components/info-page';
import { loadVitrin } from '@/lib/medusa/vitrin';
import { currentCustomer } from '@/lib/medusa/session';

export const metadata: Metadata = {
  title: 'B2B Bayi Girişi',
  description: 'Bayi ve kurumsal müşterilerimiz için giriş ve başvuru.',
};

/* Honest about what exists: dealers sign in with an ordinary account; dealer
   pricing and bulk orders run through their sales contact. There is no
   separate B2B price display yet, so the page does not promise one. */
export default async function B2bPage() {
  const [{ company }, customer] = await Promise.all([loadVitrin(), currentCustomer()]);
  return (
    <InfoPage
      path="/b2b-giris"
      eyebrow="Bayi ve kurumsal"
      title="B2B Bayi Girişi"
      lede="Bayilerimiz ve kurumsal müşterilerimiz sitemizdeki hesaplarıyla giriş yapar; toplu sipariş ve bayi fiyatlandırması satış temsilcisiyle birlikte yürütülür."
      company={company}
    >
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <Link
          href={customer ? '/hesabim' : '/hesabim?next=/hesabim'}
          className="group flex flex-col justify-between gap-6 rounded-(--panel-radius) border border-line bg-surface-page p-5 transition-colors hover:border-text-primary"
        >
          <span className="grid h-10 w-10 place-items-center rounded-(--card-radius) bg-brand text-white">
            <LogIn size={18} strokeWidth={2} aria-hidden />
          </span>
          <span>
            <span className="block text-[16px] font-extrabold text-text-primary">
              {customer ? 'Hesabınıza gidin' : 'Bayi hesabınızla giriş yapın'}
            </span>
            <span className="mt-1 block text-[13px] text-text-secondary">
              {customer ? `${customer.email} olarak giriş yaptınız.` : 'Kayıtlı e-posta adresiniz ve şifrenizle.'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-text-primary">
            {customer ? 'Hesabım' : 'Giriş yap'}
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          href="/bayi-basvurusu"
          className="group flex flex-col justify-between gap-6 rounded-(--panel-radius) border border-line bg-surface-page p-5 transition-colors hover:border-text-primary"
        >
          <span className="grid h-10 w-10 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white">
            <Building2 size={18} strokeWidth={2} aria-hidden />
          </span>
          <span>
            <span className="block text-[16px] font-extrabold text-text-primary">Henüz bayimiz değil misiniz?</span>
            <span className="mt-1 block text-[13px] text-text-secondary">Başvurunuzu bırakın, satış ekibimiz dönüş yapsın.</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-text-primary">
            Bayi başvurusu
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <h2>Bayilerimiz için</h2>
      <ul>
        <li>Toplu siparişler için ürün kodlarıyla birlikte liste iletin; stok ve fiyat teklifini aynı gün hazırlayalım.</li>
        <li>Proje bazlı alımlarda kurulum ihtiyacınıza göre kamera, kayıt cihazı ve aksesuar seçimi yapalım.</li>
        <li>
          Siparişlerinizi ve geçmiş faturalarınızı <Link href="/hesabim">Hesabım</Link> sayfasından takip edin.
        </li>
      </ul>
      <p>
        Toplu alım talepleriniz için <Link href="/toptan-satis">Toptan Satış</Link>, proje teklifleri için{' '}
        <Link href="/kurumsal">Kurumsal Satış</Link> formunu kullanabilirsiniz.
      </p>
    </InfoPage>
  );
}
