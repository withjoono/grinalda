'use client';

import { AlertCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorSectionProps {
  text?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorSection({
  text = '데이터를 불러오는데 실패했습니다.',
  onRetry,
  className,
}: ErrorSectionProps) {
  return (
    <section className={cn('px-4 py-40', className)}>
      <div className='mx-auto flex max-w-screen-md flex-col items-center gap-4'>
        <div className='rounded-full bg-destructive/10 p-4'>
          <AlertCircle className='h-6 w-6 text-destructive' />
        </div>
        <h2 className='text-center text-2xl font-semibold'>
          오류가 발생했습니다
        </h2>
        <p className='text-center text-muted-foreground'>{text}</p>
        {onRetry && (
          <Button
            variant='outline'
            onClick={onRetry}
            className='mt-2 flex items-center gap-2'
          >
            <RotateCw className='h-4 w-4' />
            다시시도
          </Button>
        )}
      </div>
    </section>
  );
}
