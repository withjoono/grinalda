'use client';

import { columns } from './data-table/columns';
import { EarlyAdmissionsDataTable } from './data-table/early-admissions-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { useAllSearchTags } from '@/apis/hooks/use-search-tags';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useAllEarlyAdmissions } from '@/apis/hooks/use-early-admissions';

export default function AdminDataEarlyAdmissionsPage() {
  const {
    data: earlyAdmissions,
    isPending: isEarlyAdmissionsPending,
    isError: isEarlyAdmissionsError,
    refetch: refetchEarlyAdmissions,
  } = useAllEarlyAdmissions();
  const {
    data: searchTags,
    isPending: isSearchTagsPending,
    isError: isSearchTagsError,
    refetch: refetchSearchTags,
  } = useAllSearchTags();

  if (isEarlyAdmissionsPending) return <LoadingSection />;
  if (isEarlyAdmissionsError)
    return <ErrorSection onRetry={refetchEarlyAdmissions} />;

  if (isSearchTagsPending) return <LoadingSection />;
  if (isSearchTagsError) return <ErrorSection onRetry={refetchSearchTags} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>수시전형 목록</h1>
        <Button asChild>
          <Link href={PageRoutes.ADMIN_EARLY_ADMISSIONS + '/create'}>
            수시전형 추가
          </Link>
        </Button>
      </div>
      <EarlyAdmissionsDataTable
        data={earlyAdmissions}
        columns={columns}
        searchTags={searchTags}
      />
    </div>
  );
}
