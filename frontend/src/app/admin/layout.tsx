import AdminHeader from '@/components/layouts/admin-layout/admin-header';
import AdminSidebar from '@/components/layouts/admin-layout/admin-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageRoutes } from '@/constants/routes';
import { authOptions } from '@/lib/auth-options';
import { cn } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'ROLE_ADMIN') {
    redirect(PageRoutes.HOME);
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className='flex w-full'>
        <AdminSidebar />
        <div className='w-full overflow-hidden'>
          <AdminHeader session={session} />
          <main className={cn('min-h-full p-4', '')}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
