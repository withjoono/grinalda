'use client';

import { RegionsDataTable } from './data-table/regions-table';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateRegionDialog } from './create-region-dialog';
import { useAllRegions } from '@/apis/hooks/use-regions';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';

export default function AdminDataRegionsPage() {
  const { data: regions, isPending, isError, refetch } = useAllRegions();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>지역 목록</h1>
        <CreateRegionDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            지역 추가
          </Button>
        </CreateRegionDialog>
      </div>
      <RegionsDataTable data={regions} columns={columns} />
    </div>
  );
}
