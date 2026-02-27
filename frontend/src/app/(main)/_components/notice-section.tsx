'use client';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { useAllNotice } from '@/apis/hooks/use-boards';
import { format } from 'date-fns';
import { NoticeCategoryBadge } from '@/components/badges/notice-category-badge';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';

export default function NoticeSection() {
  const { data: notices, isPending, isError, refetch } = useAllNotice();

  if (isPending) return <LoadingSection className='py-20' />;
  if (isError)
    return (
      <ErrorSection
        text='공지사항을 불러오는 중 오류가 발생했습니다.'
        onRetry={refetch}
      />
    );

  return (
    <div className=''>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-8 md:mb-10 lg:mb-8'>
          <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
              <h1 className='w-full text-2xl font-bold lg:text-3xl'>
                공지사항
              </h1>
              <Link
                href={PageRoutes.COMMUNITY_NOTICE}
                className='shrink-0 text-gray-500 hover:text-gray-700'
              >
                더보기 +
              </Link>
            </div>
          </div>
        </div>
        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
          {notices ? (
            notices?.slice(0, 6).map((notice) => (
              <Link
                href={`${PageRoutes.COMMUNITY_NOTICE}?id=${notice.id}`}
                key={notice.id}
                className='flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 transition-colors last:border-b-0 hover:bg-gray-50'
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <NoticeCategoryBadge category={notice.category} />
                  </div>
                  <span className='truncate text-sm font-medium text-gray-900'>
                    {notice.title}
                  </span>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs text-gray-500'>
                    {format(notice.createdAt, 'yyyy.MM.dd')}
                  </span>
                  <svg
                    className='h-4 w-4 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </Link>
            ))
          ) : (
            <p className='py-20 text-center text-gray-500'>
              게시글이 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
