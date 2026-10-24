import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AccountShell } from '@/app/hesabim/account-shell';
import { PasswordForm, ProfileForm } from '@/app/hesabim/profile-forms';
import { currentCustomer } from '@/lib/medusa/session';

export const metadata: Metadata = {
  title: 'Hesap bilgileri',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const customer = await currentCustomer();
  if (!customer) redirect('/hesabim?next=/hesabim/bilgiler');
  // Medusa keeps phones as +905…; shown in the familiar 05… form.
  const phone = customer.phone?.replace(/^\+90/, '0') ?? '';
  return (
    <AccountShell customer={customer} path="/hesabim/bilgiler" title="Hesap bilgileri">
      <div className="space-y-(--space-grid-gap)">
        <ProfileForm
          email={customer.email}
          initial={{
            first_name: customer.first_name ?? '',
            last_name: customer.last_name ?? '',
            phone,
            company_name: customer.company_name ?? '',
          }}
        />
        <PasswordForm />
      </div>
    </AccountShell>
  );
}
