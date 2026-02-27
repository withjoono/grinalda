'use client';

import { Notice } from '@/apis/hooks/use-boards';
import { NoticeCategoryBadge } from '@/components/badges/notice-category-badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface NoticeListProps {
  notices: Notice[];
  onSelectNoticeId: (id: number) => void;
}

export const NoticeList = ({ notices, onSelectNoticeId }: NoticeListProps) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const hasMore = filteredNotices.length < notices.length;

  useEffect(() => {
    setFilteredNotices(notices.slice(0, itemsPerPage));
  }, [notices]);

  const loadMore = () => {
    const nextPage = page + 1;
    setFilteredNotices(notices.slice(0, nextPage * itemsPerPage));
    setPage(nextPage);
  };

  return (
    <div className='space-y-2'>
      {filteredNotices.map((notice, idx) => (
        <div
          key={idx}
          onClick={() => onSelectNoticeId(notice.id)}
          className='flex cursor-pointer items-center justify-between rounded-lg p-4 transition-colors hover:bg-gray-100'
        >
          <div className='flex items-center space-x-2'>
            {notice.category && (
              <NoticeCategoryBadge category={notice.category} />
            )}
            <h2 className='line-clamp-1 text-sm font-medium lg:text-sm'>
              {notice.title}
            </h2>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-xs text-gray-500'>
              {new Date(notice.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}

      <div className='pt-8'>
        {hasMore ? (
          <div className='flex justify-center'>
            <Button onClick={loadMore} variant={'outline'} className='px-20'>
              더보기 ({filteredNotices.length}/{notices.length})
            </Button>
          </div>
        ) : (
          <p className='text-center text-sm text-muted-foreground'>
            마지막 게시글입니다.
          </p>
        )}
      </div>
    </div>
  );
};
