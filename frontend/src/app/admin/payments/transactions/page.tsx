'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useGetAdminPayments } from '@/apis/hooks/admin/use-admin-payments';
import { PaymentsDataTable } from './data-table/payments-table';
import { columns } from './data-table/columns';

export default function AdminPaymentsTransactionsPage() {
  const { data: payments, isPending, isError, refetch } = useGetAdminPayments();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>결제 내역</h1>
      </div>
      <PaymentsDataTable data={payments} columns={columns} />
    </div>
  );
}
