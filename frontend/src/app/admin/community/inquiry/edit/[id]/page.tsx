'use client';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useParams } from 'next/navigation';
import { useAllInquiry } from '@/apis/hooks/admin/use-admin-inquiry';
import CreateInquiryReplyForm from '../../create-inquiry-reply-form';
import { DeleteInquiryReplyDialog } from '../../delete-inquiry-reply-dialog';

export default function EditNoticePage() {
  const params = useParams<{ id: string }>();

  const {
    data: allInquiry,
    isPending: isAllInquiryPending,
    isError: isAllInquiryError,
    refetch: refetchAllInquiry,
  } = useAllInquiry();

  if (isAllInquiryPending) return <LoadingSection />;
  if (isAllInquiryError)
    return (
      <ErrorSection
        onRetry={refetchAllInquiry}
        text='문의 목록을 불러오는 중 오류가 발생했습니다.'
      />
    );

  const inquiry = allInquiry?.find(
    (inquiry) => inquiry.id === Number(params.id)
  );

  if (!inquiry) return <ErrorSection text='문의를 찾을 수 없습니다.' />;

  return (
    <div className='container mx-auto max-w-2xl pt-12'>
      <div className='mx-auto space-y-2'>
        <h3 className='text-2xl font-bold'>{inquiry.title}</h3>
        <div className='flex items-end justify-between'>
          <div>
            <p className='text-sm text-gray-500'>
              질문자 - {inquiry.author.name}
            </p>
            <p className='text-sm text-gray-500'>
              이메일 - {inquiry.author.email}
            </p>
            <p className='text-sm text-gray-500'>
              문의일 - {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className='py-10 text-sm text-gray-500'>{inquiry.content}</p>
      </div>
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
                <DeleteInquiryReplyDialog
                  replyId={reply.id}
                  inquiryId={inquiry.id}
                >
                  <p className='text-sm text-red-500'>삭제</p>
                </DeleteInquiryReplyDialog>
              </div>
            ))}
          </div>
        ) : (
          <div className='rounded-lg bg-gray-50 p-6 text-center text-gray-500'>
            답변 대기중입니다.
          </div>
        )}
      </div>
      <div className='mx-auto pt-8'>
        <CreateInquiryReplyForm inquiry={inquiry} />
      </div>
    </div>
  );
}
