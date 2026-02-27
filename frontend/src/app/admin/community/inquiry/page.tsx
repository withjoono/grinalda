'use client';

import { columns } from './data-table/columns';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllInquiry } from '@/apis/hooks/admin/use-admin-inquiry';
import { InquiryDataTable } from './data-table/inquiry-table';

export default function AdminInquiryPage() {
  const {
    data: inquiries,
    isPending: isInquiryPending,
    isError: isInquiryError,
    refetch: refetchInquiry,
  } = useAllInquiry();

  if (isInquiryPending) return <LoadingSection />;
  if (isInquiryError) return <ErrorSection onRetry={refetchInquiry} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>문의 목록</h1>
      </div>
      <InquiryDataTable data={inquiries} columns={columns} />
    </div>
  );
}
