import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';

import { Field, inputClass } from '@/components/form-field';
import { InfoPage } from '@/components/info-page';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { currentCustomer } from '@/lib/medusa/session';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Sipariş Takibi',
  description: 'Sipariş numaranız ve e-posta adresinizle siparişinizin durumunu görün.',
  robots: { index: false, follow: true },
};

/**
 * /siparis-takibi — a plain GET form (works without JavaScript): the order
 * number and the e-mail it was placed with go to GET /store/order-lookup; on
 * a match the visitor lands on the order's own page, the one the
 * confirmation link opens.
 */
export default async function OrderTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ no?: string; eposta?: string }>;
}) {
  const [{ no = '', eposta = '' }, { company }, customer] = await Promise.all([
    searchParams,
    loadVitrin(),
    currentCustomer(),
  ]);

  let error = '';
  if (no || eposta) {
    if (!no.replace(/\D/g, '') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim())) {
      error = 'Sipariş numaranızı ve siparişte kullandığınız e-posta adresini girin.';
    } else {
      let id: string | null = null;
      try {
        ({ id } = await medusa<{ id: string }>('/store/order-lookup', {
          cache: 'no-store',
          query: { number: no.replace(/\D/g, ''), email: eposta.trim() },
        }));
      } catch (caught) {
        error =
          caught instanceof MedusaError && caught.status === 404
            ? 'Bu bilgilerle bir sipariş bulunamadı. Sipariş numarasını ve e-posta adresini kontrol edin.'
            : 'Şu anda sorgulama yapılamıyor. Birazdan tekrar deneyin.';
      }
      if (id) redirect(`/siparis/${id}`);
    }
  }

  return (
    <InfoPage
      path="/siparis-takibi"
      eyebrow="Yardım"
      title="Sipariş Takibi"
      lede="Sipariş numaranızı ve siparişte kullandığınız e-posta adresini girin; siparişinizin durumunu ve ayrıntılarını görün."
      company={company}
    >
      <form method="get" action="/siparis-takibi" className="not-prose rounded-(--panel-radius) border border-line bg-surface-page p-5">
        {error ? (
          <p role="alert" className="mb-4 rounded-(--card-radius) border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[14px] font-medium text-danger-ink">
            {error}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="no" label="Sipariş numarası" hint="Sipariş onay sayfasında yazan, SE- ile başlayan numara.">
            <input id="no" name="no" defaultValue={no} placeholder="Örn. SE-1024" required className={inputClass} />
          </Field>
          <Field name="eposta" label="E-posta adresi">
            <input id="eposta" name="eposta" type="email" defaultValue={eposta} autoComplete="email" required className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[16px] font-bold text-white shadow-e2 transition-[transform,background-color] hover:-translate-y-px hover:bg-brand-dark"
        >
          <Search size={17} strokeWidth={2} aria-hidden />
          Siparişi bul
        </button>
      </form>

      <h2>Sipariş durumları</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">Sipariş alındı</th>
            <td>Siparişiniz bize ulaştı. Havale / EFT siparişlerinde ödemeniz bekleniyor.</td>
          </tr>
          <tr>
            <th scope="row">Hazırlanıyor</th>
            <td>Ödemeniz onaylandı, siparişiniz paketleniyor.</td>
          </tr>
          <tr>
            <th scope="row">Kargoda</th>
            <td>Siparişiniz kargo firmasına teslim edildi.</td>
          </tr>
          <tr>
            <th scope="row">Teslim edildi</th>
            <td>Siparişiniz adresinize teslim edildi.</td>
          </tr>
        </tbody>
      </table>
      <p>
        {customer ? (
          <>
            Tüm siparişleriniz <Link href="/hesabim">Hesabım</Link> sayfasında listelenir.
          </>
        ) : (
          <>
            Üyeyseniz <Link href="/hesabim">giriş yaparak</Link> tüm siparişlerinizi görebilirsiniz. Havale yaptıysanız{' '}
            <Link href="/havale-bildirim">Havale Bildirim Formu</Link>&apos;nu doldurmayı unutmayın.
          </>
        )}
      </p>
    </InfoPage>
  );
}
