'use client';

import { useAllFaq } from '@/apis/hooks/use-boards';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateFaqDialog } from './create-faq-dialog';
import { FaqDataTable } from './data-table/faq-table';
import { columns } from './data-table/columns';

export default function AdminCommunityFaqPage() {
  const { data: faqs, isPending, isError, refetch } = useAllFaq();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>FAQ 목록</h1>
          <p className='text-sm text-muted-foreground'>
            id가 낮을수록 상단에 보여집니다.
          </p>
        </div>
        <CreateFaqDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            FAQ 추가
          </Button>
        </CreateFaqDialog>
      </div>
      <FaqDataTable data={faqs} columns={columns} />
    </div>
  );
}
