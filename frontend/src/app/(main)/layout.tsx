import Footer from '@/components/layouts/main-layout/footer';
import { NavBar } from '@/components/layouts/main-layout/navbar';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='pt-20'>
      <NavBar />
      <main className='min-h-[60vh]'>{children}</main>
      <Footer />
    </div>
  );
}
