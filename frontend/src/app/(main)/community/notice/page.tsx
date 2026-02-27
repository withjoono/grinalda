'use client';

import { useAllNotice } from '@/apis/hooks/use-boards';
import { NoticeDetail } from './notice-detail';
import { NoticeList } from './notice-list';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '@/components/minimal-tiptap/styles/index.css';

const CommunityNoticePage = () => {
  const { data: notices, isPending, isError, refetch } = useAllNotice();
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const initialData = useMemo(() => notices ?? [], [notices]);

  const searchParams = useSearchParams();
  const noticeId = searchParams.get('id');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedNoticeId]);

  useEffect(() => {
    if (noticeId) {
      setSelectedNoticeId(Number(noticeId));
    }
  }, [noticeId]);

  if (isPending)
    return (
      <div className='mx-auto w-full py-8'>
        <LoadingSection />;
      </div>
    );
  if (isError)
    return (
      <div className='mx-auto w-full py-8'>
        <ErrorSection onRetry={refetch} />
      </div>
    );

  const selectedNotice = notices?.find(
    (notice) => notice.id === selectedNoticeId
  );

  return (
    <div className='mx-auto w-full py-8'>
      {selectedNotice ? (
        <NoticeDetail
          notice={selectedNotice}
          onBack={() => setSelectedNoticeId(null)}
        />
      ) : (
        <NoticeList
          notices={initialData}
          onSelectNoticeId={setSelectedNoticeId}
        />
      )}
    </div>
  );
};

export default CommunityNoticePage;
