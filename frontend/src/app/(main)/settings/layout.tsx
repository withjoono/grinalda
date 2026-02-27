import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './_components/sidebar-nav';
import { PageRoutes } from '@/constants/routes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { RequireAuthSection } from '@/components/status/require-auth-section';

const sidebarNavItems = [
  {
    title: '프로필',
    href: PageRoutes.USER_PROFILE,
  },
  {
    title: '비밀번호 변경',
    href: PageRoutes.USER_CHANGE_PASSWORD,
  },
  {
    title: '결제내역',
    href: PageRoutes.USER_PAYMENT,
  },
  {
    title: '회원탈퇴',
    href: PageRoutes.USER_LEAVE,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) return <RequireAuthSection />;
  return (
    <div className='mx-auto w-full max-w-7xl space-y-6 px-6 py-20 pb-64 md:block lg:px-10'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>설정</h2>
        <p className='text-muted-foreground'>
          프로필 및 계정 설정 설정을 관리합니다.
        </p>
      </div>
      <Separator className='my-6' />
      <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <aside className='lg:w-1/5'>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex-1 lg:max-w-4xl'>{children}</div>
      </div>
    </div>
  );
}
