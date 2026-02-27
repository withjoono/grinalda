'use client';

import { columns } from './data-table/columns';
import { SearchTagsDataTable } from './data-table/search-tags-table';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateSearchTagDialog } from './create-search-tag-dialog';
import { useAllSearchTags } from '@/apis/hooks/use-search-tags';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';

export default function AdminDataSearchTagsPage() {
  const { data: searchTags, isPending, isError, refetch } = useAllSearchTags();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>검색 태그 목록</h1>
        <CreateSearchTagDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            검색 태그 추가
          </Button>
        </CreateSearchTagDialog>
      </div>
      <SearchTagsDataTable data={searchTags} columns={columns} />
    </div>
  );
}
