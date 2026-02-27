import { Button } from '@/components/ui/button';
import { PageRoutes } from '@/constants/routes';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RequireAuthSectionProps {
  className?: string;
}

export function RequireAuthSection({ className }: RequireAuthSectionProps) {
  return (
    <section className={cn('px-4 py-80', className)}>
      <div className='mx-auto flex max-w-screen-md flex-col items-center gap-4'>
        <div className='rounded-full bg-muted p-4'>
          <LogIn className='h-6 w-6 text-primary' />
        </div>
        <h2 className='text-center text-2xl font-semibold'>
          로그인이 필요합니다
        </h2>
        <p className='text-center text-muted-foreground'>
          이 페이지를 이용하기 위해서는 로그인이 필요합니다.
        </p>
        <Button asChild className='mt-2'>
          <Link href={PageRoutes.LOGIN}>로그인하러 가기</Link>
        </Button>
      </div>
    </section>
  );
}
