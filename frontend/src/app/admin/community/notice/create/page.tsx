'use client';

import { useAllNoticeCategory } from '@/apis/hooks/use-boards';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import NoticeForm from '../notice-form';

export default function CreateNoticePage() {
  const {
    data: noticeCategories,
    isPending: noticeCategoriesPending,
    isError: noticeCategoriesError,
    refetch: noticeCategoriesRefetch,
  } = useAllNoticeCategory();

  if (noticeCategoriesPending) return <LoadingSection />;
  if (noticeCategoriesError)
    return (
      <ErrorSection
        onRetry={noticeCategoriesRefetch}
        text='공지사항 카테고리 데이터를 불러오는 중 오류가 발생했습니다.'
      />
    );

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <NoticeForm noticeCategories={noticeCategories} />
      </div>
    </div>
  );
}
