'use client';

import { PageRoutes } from '@/constants/routes';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllNotice } from '@/apis/hooks/use-boards';
import { NoticeDataTable } from './data-table/notice-table';

export default function AdminNoticePage() {
  const {
    data: notices,
    isPending: isNoticePending,
    isError: isNoticeError,
    refetch: refetchNotice,
  } = useAllNotice();

  if (isNoticePending) return <LoadingSection />;
  if (isNoticeError) return <ErrorSection onRetry={refetchNotice} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>공지사항 목록</h1>
        <Button asChild>
          <Link href={PageRoutes.ADMIN_COMMUNITY_NOTICE + '/create'}>
            게시글 작성
          </Link>
        </Button>
      </div>
      <NoticeDataTable data={notices} columns={columns} />
    </div>
  );
}
