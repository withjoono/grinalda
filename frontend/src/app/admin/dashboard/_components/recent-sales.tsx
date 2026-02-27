import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { RecentPayment } from '@/apis/hooks/admin/use-admin-statistics';

export function RecentSales({ data }: { data: RecentPayment[] }) {
  return (
    <div className='space-y-8'>
      {data.map((data, idx) => {
        return (
          <div key={idx} className='flex items-center gap-4'>
            <p className='shrink-0 text-sm font-semibold text-foreground/50'>
              {idx + 1}
            </p>
            <div className='w-full space-y-1'>
              <p className='line-clamp-1 text-sm font-medium leading-none hover:line-clamp-none'>
                <b>{data.user.name || '알수없음'}</b> 님이{' '}
                <b>{data.product.name}</b>를 구매했습니다.
              </p>
              <p className='text-sm text-muted-foreground'>
                {data.user.email} |{' '}
                {format(new Date(data.paidAt), 'yyyy-MM-dd HH:mm:ss')}
              </p>
            </div>
            <div className='shrink-0 font-bold'>
              + {formatPrice(data.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
