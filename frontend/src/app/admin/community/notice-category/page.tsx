'use client';

import { useAllNoticeCategory } from '@/apis/hooks/use-boards';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateNoticeCategoryDialog } from './create-notice-category-dialog';
import { columns } from './data-table/columns';
import { NoticeCategoryDataTable } from './data-table/faq-table';

export default function AdminCommunityFaqPage() {
  const {
    data: noticeCategories,
    isPending,
    isError,
    refetch,
  } = useAllNoticeCategory();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            공지사항 카테고리 목록
          </h1>
        </div>
        <CreateNoticeCategoryDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            카테고리 추가
          </Button>
        </CreateNoticeCategoryDialog>
      </div>
      <NoticeCategoryDataTable data={noticeCategories} columns={columns} />
    </div>
  );
}
