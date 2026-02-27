'use client';

import { PageRoutes } from '@/constants/routes';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAllUniversities } from '@/apis/hooks/use-universities';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { UniversitiesDataTable } from './data-table/universities-table';

export default function AdminDataUniversitiesPage() {
  const {
    data: universities,
    isPending,
    isError,
    refetch,
  } = useAllUniversities();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>대학 목록</h1>
        <Button asChild>
          <Link href={PageRoutes.ADMIN_UNIVERSITIES + '/create'}>
            대학 추가
          </Link>
        </Button>
      </div>
      <UniversitiesDataTable data={universities} columns={columns} />
    </div>
  );
}
