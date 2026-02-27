'use client';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useParams } from 'next/navigation';
import { useAllProducts } from '@/apis/hooks/admin/use-admin-products';
import ProductForm from '../../product-form';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();

  const {
    data: products,
    isPending: productsPending,
    isError: productsError,
    refetch: productsRefetch,
  } = useAllProducts();

  if (productsPending) return <LoadingSection />;
  if (productsError)
    return (
      <ErrorSection
        onRetry={productsRefetch}
        text='상품 데이터를 불러오는 중 오류가 발생했습니다.'
      />
    );

  const product = products?.find((product) => product.id === Number(params.id));

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4 pb-12'>
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
