import Footer from '@/components/layouts/main-layout/footer';
import { NavBar } from '@/components/layouts/main-layout/navbar';
import { NotFoundSection } from '@/components/status/not-found-section';
import React from 'react';

const NotFoundPage = () => {
  return (
    <main>
      <NavBar />
      <NotFoundSection className='flex h-[80vh] items-center' />
      <Footer />
    </main>
  );
};

export default NotFoundPage;
