import { Inquiry } from '@/apis/hooks/use-boards';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { DeleteInquiryDialog } from './delete-inquiry-dialog';

interface InquiryDetailProps {
  inquiry: Inquiry;
  onBack: () => void;
}

export const InquiryDetail = ({ inquiry, onBack }: InquiryDetailProps) => {
  return (
    <div className='mx-auto space-y-6'>
      {/* 헤더 영역 */}
      <div className='flex items-center justify-between border-b pb-4'>
        <Button size={'sm'} variant={'ghost'} onClick={onBack}>
          <ArrowLeftIcon className='mr-2 size-4' /> 뒤로가기
        </Button>
        <DeleteInquiryDialog inquiryId={inquiry.id} onBack={onBack}>
          <Button size={'sm'} variant={'destructive'}>
            문의 삭제
          </Button>
        </DeleteInquiryDialog>
      </div>

      {/* 문의 내용 영역 */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>{inquiry.title}</h1>
          <p className='text-sm text-muted-foreground'>
            작성일: {new Date(inquiry.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className='mt-6 rounded-lg bg-gray-50 p-6'>
          <p className='whitespace-pre-line leading-relaxed text-gray-700'>
            {inquiry.content.replace(/\\n/g, '\n')}
          </p>
        </div>
      </div>

      {/* 답변 영역 */}
      <div className='mt-8'>
        <h2 className='mb-4 text-lg font-semibold'>답변</h2>
        {inquiry.replies.length ? (
          <div className='space-y-4'>
            {inquiry.replies.map((reply) => (
              <div key={reply.id} className='rounded-lg bg-gray-50 p-6'>
                <p className='whitespace-pre-line leading-relaxed text-gray-700'>
                  {reply.content.replace(/\\n/g, '\n')}
                </p>
                <p className='pt-4 text-sm text-gray-500'>
                  답변시간: {new Date(reply.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='rounded-lg bg-gray-50 p-6 text-center text-gray-500'>
            답변 대기중입니다.
          </div>
        )}
      </div>
    </div>
  );
};
