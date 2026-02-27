'use client';

import { Inquiry } from '@/apis/hooks/use-boards';
import { Button } from '@/components/ui/button';
import { CreateInquiryDialog } from './create-inquiry-dialog';
import { Badge } from '@/components/ui/badge';

interface InquiryListProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
  refetch: () => void;
}

export const InquiryList = ({
  inquiries,
  onSelectInquiry,
  refetch,
}: InquiryListProps) => {
  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between pb-8'>
        <h3 className='text-xl font-bold'>내 문의 내역</h3>
        <div className='flex items-center gap-2'>
          <CreateInquiryDialog>
            <Button>문의하기</Button>
          </CreateInquiryDialog>
          <Button variant='outline' onClick={() => refetch()}>
            새로고침
          </Button>
        </div>
      </div>
      {inquiries.map((inquiry, idx) => (
        <div
          key={idx}
          onClick={() => onSelectInquiry(inquiry)}
          className='flex cursor-pointer items-center justify-between gap-2 rounded-lg p-4 transition-colors hover:bg-gray-100'
        >
          <Badge
            variant={inquiry.replies.length ? 'default' : 'outline'}
            className='shrink-0 text-xs'
          >
            {inquiry.replies.length ? '답변완료' : '대기중'}
          </Badge>
          <div className='flex w-full items-center space-x-2'>
            <h2 className='line-clamp-1 text-sm font-medium lg:text-sm'>
              {inquiry.title}
            </h2>
          </div>
          <div className='flex shrink-0 items-center space-x-4'>
            <span className='text-xs text-gray-500'>
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
      {inquiries.length === 0 && (
        <p className='py-20 text-center text-sm text-muted-foreground'>
          문의 내역이 없습니다.
        </p>
      )}
    </div>
  );
};
