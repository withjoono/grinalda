'use client';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useParams } from 'next/navigation';
import { useAllNoticeCategory, useNoticeDetail } from '@/apis/hooks/use-boards';
import NoticeForm from '../../notice-form';

export default function EditNoticePage() {
  const params = useParams<{ id: string }>();

  const {
    data: notice,
    isPending: isNoticePending,
    isError: isNoticeError,
    refetch: refetchNotice,
  } = useNoticeDetail(Number(params.id));

  const {
    data: noticeCategories,
    isPending: noticeCategoriesPending,
    isError: noticeCategoriesError,
    refetch: noticeCategoriesRefetch,
  } = useAllNoticeCategory();

  if (isNoticePending) return <LoadingSection />;
  if (isNoticeError)
    return (
      <ErrorSection
        onRetry={refetchNotice}
        text='공지사항 데이터를 불러오는 중 오류가 발생했습니다.'
      />
    );

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
        <NoticeForm noticeCategories={noticeCategories} initialData={notice} />
      </div>
    </div>
  );
}
