'use client';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Inquiry } from '@/apis/hooks/use-boards';
import { useMyInquiry } from '@/apis/hooks/use-boards';
import { useMemo } from 'react';
import { useState } from 'react';
import { InquiryList } from './inquiry-list';
import { InquiryDetail } from './inquiry-detail';

const CommunityInquiryPage = () => {
  const { data: myInquiry, isPending, isError, refetch } = useMyInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const initialData = useMemo(() => myInquiry ?? [], [myInquiry]);

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

  return (
    <div className='mx-auto w-full py-8'>
      {selectedInquiry ? (
        <InquiryDetail
          inquiry={selectedInquiry}
          onBack={() => setSelectedInquiry(null)}
        />
      ) : (
        <InquiryList
          inquiries={initialData}
          onSelectInquiry={setSelectedInquiry}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default CommunityInquiryPage;
