'use client';

import { useActiveProducts } from '@/apis/hooks/use-products';
import { Pricing } from './_components/pricing';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useGetActiveSubscriptions } from '@/apis/hooks/use-payments';

export default function PurchasePage() {
  const { data: products, isPending, isError, refetch } = useActiveProducts();
  const { data: activeSubscriptions } = useGetActiveSubscriptions();
  const activeServiceCodes = activeSubscriptions?.map(
    (subscription) => subscription.serviceCode
  );

  if (isPending) return <LoadingSection />;
  if (isError)
    return <ErrorSection text='상품 목록 조회 실패' onRetry={refetch} />;

  const plans = products
    .filter((product) => product.categoryCode === 'S')
    .sort((a, b) => a.id - b.id);

  const consultingPlans = products
    .filter((product) => product.categoryCode === 'C')
    .sort((a, b) => a.id - b.id);

  return (
    <div className='min-h-screen py-12 sm:py-20'>
      <Pricing
        plans={plans}
        consultingPlans={consultingPlans}
        activeServiceCodes={activeServiceCodes ?? []}
      />
    </div>
  );
}
