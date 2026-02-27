import { buttonVariants } from '@/components/ui/button';
import { PageRoutes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface NotFoundSectionProps {
  className?: string;
}

export function NotFoundSection({ className }: NotFoundSectionProps) {
  return (
    <section className={cn('px-4 py-40', className)}>
      <div className='mx-auto flex max-w-screen-md flex-col items-center gap-4'>
        <div className='space-y-6 p-8 text-center'>
          <h1 className='text-6xl font-bold text-gray-800'>404</h1>
          <div className='space-y-4'>
            <p className='text-2xl font-semibold text-gray-600'>
              페이지를 찾을 수 없습니다
            </p>
            <p className='mx-auto max-w-md text-muted-foreground'>
              요청하신 페이지가 삭제되었거나 잘못된 경로입니다.
            </p>
            <Link
              href={PageRoutes.HOME}
              className={buttonVariants({ variant: 'outline' })}
            >
              메인으로
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
