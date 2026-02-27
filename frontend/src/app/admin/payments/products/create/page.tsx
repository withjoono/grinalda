'use client';

import ProductForm from '../product-form';

export default function CreateProductPage() {
  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4 pb-12'>
        <ProductForm />
      </div>
    </div>
  );
}
