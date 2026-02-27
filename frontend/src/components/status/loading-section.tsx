import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSectionProps {
  className?: string;
}

export function LoadingSection({ className }: LoadingSectionProps) {
  return (
    <section className={cn('px-4 py-40', className)}>
      <div className='mx-auto flex max-w-screen-md flex-col items-center gap-4'>
        <div className='rounded-full bg-muted p-4'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
        <h2 className='text-center text-2xl font-semibold'>로딩 중</h2>
        <p className='text-center text-muted-foreground'>
          잠시만 기다려주세요...
        </p>
      </div>
    </section>
  );
}
