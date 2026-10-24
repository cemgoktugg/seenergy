import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Havale Bildirim Formu',
  description: 'Havale / EFT ödemenizi bildirin; siparişiniz hızla eşleşip kargoya verilsin.',
};

export default async function TransferNoticePage({ searchParams }: { searchParams: Promise<{ siparis?: string }> }) {
  const [{ siparis }, { company }] = await Promise.all([searchParams, loadVitrin()]);
  return (
    <InfoPage
      path="/havale-bildirim"
      eyebrow="Yardım"
      title="Havale Bildirim Formu"
      lede="Havale / EFT ile ödeme yaptıysanız bildirin; ödemeniz siparişinizle hızla eşleşsin ve siparişiniz kargoya verilsin."
      company={company}
    >
      {company.iban ? (
        <>
          <h2>Banka hesabımız</h2>
          <table>
            <tbody>
              {company.bankName ? (
                <tr>
                  <th scope="row">Banka</th>
                  <td>{company.bankName}</td>
                </tr>
              ) : null}
              {company.bankHolder ? (
                <tr>
                  <th scope="row">Hesap sahibi</th>
                  <td>{company.bankHolder}</td>
                </tr>
              ) : null}
              <tr>
                <th scope="row">IBAN</th>
                <td>
                  <code>{company.iban}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Açıklama kısmına sipariş numaranızı yazmayı unutmayın.</p>
        </>
      ) : (
        <p>
          Banka hesap bilgilerimiz sipariş onay sayfanızda yer alır. Sipariş numaranızı bilmiyorsanız{' '}
          <Link href="/siparis-takibi">Sipariş Takibi</Link> sayfasından bulabilirsiniz.
        </p>
      )}

      <h2>Bildirim</h2>
      <InquiryForm
        type="havale"
        initial={{ order: siparis ?? '' }}
        fields={[
          ...CONTACT_FIELDS,
          { name: 'order', label: 'Sipariş numarası', required: true, placeholder: 'Örn. SE-1024' },
          { name: 'amount', label: 'Gönderilen tutar (TL)', required: true, placeholder: 'Örn. 2.450,00' },
          { name: 'bank', label: 'Gönderdiğiniz banka', placeholder: 'Örn. Ziraat Bankası' },
          { name: 'date', label: 'Ödeme tarihi', type: 'date' },
          { name: 'sender', label: 'Gönderen adı (farklıysa)', wide: true },
          { name: 'message', label: 'Not', type: 'textarea' },
        ]}
        submitLabel="Bildirimi gönder"
        successTitle="Bildiriminiz alındı"
        successText="Ödemeniz hesabımızda görüldüğünde siparişiniz onaylanıp kargoya verilecek."
      />
    </InfoPage>
  );
}
