import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { RequireAuthSection } from '@/components/status/require-auth-section';
import AppNav from './app-nav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <RequireAuthSection />;
  }
  return (
    <div className='px-4 py-32 pb-72'>
      <div className='mx-auto'>
        <AppNav />
        <div className='mx-auto mt-14 max-w-7xl md:px-4'>{children}</div>
      </div>
    </div>
  );
}
