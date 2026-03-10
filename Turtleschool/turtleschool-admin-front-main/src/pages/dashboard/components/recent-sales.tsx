import { RecentPaymentType, getAdminRecentPaymentsAPI } from '@/api2/statistics/dash-board';
import { formatDateYYYYMMDDHHMMSS, formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function RecentSales() {
  const [recentPayments, setRecentPayments] = useState<RecentPaymentType[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await getAdminRecentPaymentsAPI();
      if (result.success) {
        setRecentPayments(result.data);
      } else {
        toast.error(result.error);
      }
    };

    fetch();
  }, []);
  return (
    <div className="space-y-8">
      {recentPayments.map((data, idx) => {
        return (
          <div key={idx} className="flex items-center gap-4">
            <p className="shrink-0 text-sm font-semibold text-foreground/50">{idx + 1}</p>
            <div className="w-full space-y-1">
              <p className="line-clamp-1 text-sm font-medium leading-none hover:line-clamp-none">
                <b>{data.name || '알수없음'}</b> 님이 <b>{data.serviceName}</b>를 구매했습니다.
              </p>
              <p className="text-sm text-muted-foreground">
                {data.email} | {formatDateYYYYMMDDHHMMSS(new Date(data.date))}
              </p>
            </div>
            <div className="shrink-0 font-bold">+ {formatPrice(data.amount)}</div>
          </div>
        );
      })}
    </div>
  );
}
