import { SidebarTrigger } from '@/components/ui/sidebar';
import { Session } from 'next-auth';
import { UserNav } from '../main-layout/user-nav';

export default function AdminHeader({ session }: { session: Session }) {
  return (
    <div className='sticky top-0 z-10 flex flex-col'>
      <header className='flex h-14 items-center justify-between gap-2 border-b bg-background px-4 lg:h-[60px]'>
        <SidebarTrigger className='*:size-5' />
        <UserNav session={session} />
      </header>
    </div>
  );
}
