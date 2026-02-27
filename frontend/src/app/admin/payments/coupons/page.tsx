'use client';

import { CouponsDataTable } from './data-table/coupons-table';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateCouponDialog } from './create-coupon-dialog';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useAllCoupons } from '@/apis/hooks/admin/use-admin-coupons';
import { useAllProducts } from '@/apis/hooks/admin/use-admin-products';

export default function AdminPaymentsCouponsPage() {
  const { data: coupons, isPending, isError, refetch } = useAllCoupons();
  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts,
  } = useAllProducts();

  if (isPending) return <LoadingSection />;
  if (isError)
    return (
      <ErrorSection
        text='쿠폰 목록을 불러오는데 실패했습니다.'
        onRetry={refetch}
      />
    );

  if (isPendingProducts) return <LoadingSection />;
  if (isErrorProducts)
    return (
      <ErrorSection
        text='상품 목록을 불러오는데 실패했습니다.'
        onRetry={refetchProducts}
      />
    );

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>쿠폰 목록</h1>
        <CreateCouponDialog products={products}>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            쿠폰 발급
          </Button>
        </CreateCouponDialog>
      </div>
      <CouponsDataTable
        products={products}
        data={coupons}
        columns={columns(products)}
      />
    </div>
  );
}
