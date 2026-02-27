'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useParams } from 'next/navigation';
import UserForm from '../../user-form';
import { useAccountDetail } from '@/apis/hooks/admin/use-admin-accounts';

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const {
    data: account,
    isPending: isAccountPending,
    isError: isAccountError,
    refetch: refetchAccount,
  } = useAccountDetail(Number(params.id));

  if (isAccountPending) return <LoadingSection />;
  if (isAccountError) return <ErrorSection onRetry={refetchAccount} />;

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <UserForm initialData={account} />
      </div>
    </div>
  );
}
