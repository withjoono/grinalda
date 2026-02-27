'use client'; // 에러 컴포넌트는 반드시 클라이언트 컴포넌트여야 함

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('-->', error);
  }, [error]);

  return (
    <div className='flex min-h-[99vh] flex-col items-start gap-4 px-2 py-20'>
      <div className='space-y-2 lg:space-y-4'>
        <h2 className='text-3xl font-bold lg:text-5xl'>Oops!</h2>
        <p className='text-muted-foreground'>알수없는 오류가 발생했습니다.</p>
      </div>
      <Button
        onClick={
          // 세그먼트를 다시 렌더링하여 복구를 시도
          () => reset()
        }
      >
        다시 시도
      </Button>
    </div>
  );
}
