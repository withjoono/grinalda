'use client';

import { PageRoutes } from '@/constants/routes';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllProducts } from '@/apis/hooks/admin/use-admin-products';
import { ProductsDataTable } from './data-table/products-table';

export default function AdminProductsPage() {
  const { data: products, isPending, isError, refetch } = useAllProducts();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>상품 목록</h1>
        <Button asChild>
          <Link href={PageRoutes.ADMIN_PRODUCTS + '/create'}>상품 추가</Link>
        </Button>
      </div>
      <ProductsDataTable data={products} columns={columns} />
    </div>
  );
}
