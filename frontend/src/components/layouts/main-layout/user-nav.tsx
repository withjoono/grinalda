'use client';

import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { ProfileAvatar } from '@/components/ui/profile-avatar';

export const UserNav = ({ session }: { session: Session }) => {
  const handleLogout = async () => {
    signOut();
  };
  const isAdmin = session?.user?.role === 'ROLE_ADMIN';
  const isTeacher = session?.user?.role === 'ROLE_TEACHER';

  return (
    <Menubar className='h-auto border-none bg-transparent px-0 py-0 shadow-none'>
      <MenubarMenu>
        <MenubarTrigger className='' asChild>
          <Button
            variant={'ghost'}
            className='h-auto cursor-pointer py-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <ProfileAvatar
              profileImage={session?.user?.image}
              name={session?.user?.name}
              className='size-9 rounded-md'
            />
            <div className='grid flex-1 py-1 text-left text-sm leading-tight'>
              <span className='truncate text-sm font-semibold'>
                {session?.user?.name}
              </span>
              <span className='truncate text-xs'>{session?.user?.email}</span>
            </div>
            <ChevronDown className='ml-auto size-4' />
          </Button>
        </MenubarTrigger>

        <MenubarContent className='hidden w-56 lg:block' align='end' forceMount>
          <MenubarLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {session?.user?.name}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {session?.user?.email}
              </p>
            </div>
          </MenubarLabel>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem asChild className='cursor-pointer'>
              <Link href={PageRoutes.USER_PROFILE}>마이페이지</Link>
            </MenubarItem>
            {isAdmin && (
              <MenubarItem asChild className='cursor-pointer'>
                <Link href={PageRoutes.ADMIN_DASHBOARD}>어드민페이지</Link>
              </MenubarItem>
            )}
            {isTeacher && (
              <MenubarItem asChild className='cursor-pointer'>
                <Link href={PageRoutes.TEACHER_PROFILE}>평가자페이지</Link>
              </MenubarItem>
            )}
            <MenubarItem
              onClick={handleLogout}
              className='cursor-pointer text-red-500 focus:text-red-500'
            >
              로그아웃
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
