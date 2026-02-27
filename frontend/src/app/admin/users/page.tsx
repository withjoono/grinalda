'use client';
import { UsersDataTable } from './data-table/users-table';
import { columns } from './data-table/columns';
import { useAllAccounts } from '@/apis/hooks/admin/use-admin-accounts';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';

export default function AdminUsersStudentsPage() {
  const { data: users, isPending, isError, refetch } = useAllAccounts();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>유저 목록</h1>
      </div>
      <UsersDataTable data={users} columns={columns} />
    </div>
  );
}
