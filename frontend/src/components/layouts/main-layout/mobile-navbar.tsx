'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { PageRoutes } from '@/constants/routes';
import { NavConfig } from '@/constants/nav-config';

export const MobileNavbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  const isAdmin = session?.user?.role === 'ROLE_ADMIN';

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  const handleLogout = async () => {
    signOut();
  };

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-full bg-white px-6 py-4 transition duration-200 dark:bg-neutral-900',
        showBackground && '...'
      )}
    >
      <Logo />
      <MenuIcon
        className='h-6 w-6 cursor-pointer text-black dark:text-white'
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className='fixed inset-0 z-50 flex flex-col items-start justify-start space-y-2 overflow-y-auto bg-white pt-5 text-xl text-zinc-600 dark:bg-black'>
          {/* 헤더 부분 */}
          <div className='flex w-full items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800'>
            <Logo />
            <XIcon
              className='h-6 w-6 cursor-pointer text-black transition-opacity hover:opacity-70 dark:text-white'
              onClick={() => setOpen(!open)}
            />
          </div>

          {/* 메인 네비게이션 영역 */}
          <div className='w-full px-6 py-2'>
            <nav className='space-y-2'>
              {NavConfig.map((navItem, idx) => (
                <div key={`nav-${idx}`}>
                  <Link
                    href={navItem.link}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'flex h-12 items-center text-lg font-medium text-black transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300'
                    )}
                  >
                    {navItem.title}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className='w-full px-6'>
            <Separator />
            {!session ? (
              <div className='flex w-full flex-row items-start gap-2.5 py-4'>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'w-full'
                  )}
                  href='/signup'
                >
                  회원가입
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'w-full'
                  )}
                  href='/login'
                >
                  로그인
                </Link>
              </div>
            ) : (
              <div className='flex w-full flex-row items-start gap-2.5 py-4'>
                <Button
                  variant={'ghost'}
                  onClick={handleLogout}
                  className='w-full text-red-500 hover:text-red-500'
                >
                  로그아웃
                </Button>
                {isAdmin && (
                  <Link
                    href={PageRoutes.ADMIN_DASHBOARD}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full'
                    )}
                  >
                    어드민페이지
                  </Link>
                )}
                <Link
                  href={PageRoutes.USER_PROFILE}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
                >
                  마이페이지
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
