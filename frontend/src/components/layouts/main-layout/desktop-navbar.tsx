'use client';
import { NavBarItem } from './navbar-item';
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserNav } from './user-nav';
import { NavConfig } from '@/constants/nav-config';

export const DesktopNavbar = () => {
  const { data: session } = useSession();

  const { scrollY } = useScroll();
  const [showBackground, setShowBackground] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 20) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <div
      className={cn(
        'relative flex w-full justify-between rounded-full bg-transparent px-8 py-3 transition duration-200',
        showBackground &&
          'bg-neutral-50 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:bg-neutral-900 dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]'
      )}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className='pointer-events-none absolute inset-0 h-full w-full rounded-full'
          />
        )}
      </AnimatePresence>
      <div className='flex flex-row items-center gap-2'>
        <Logo />
        <div className='flex items-center gap-1.5 pl-12'>
          {NavConfig.map((item) =>
            item.items ? (
              <NavigationMenu key={item.title}>
                <NavigationMenuList>
                  <NavigationMenuItem className='text-muted-foreground'>
                    <NavigationMenuTrigger
                      className={cn(
                        'h-11 bg-transparent',
                        pathname.startsWith(item.link) &&
                          'bg-gray-100 text-black dark:bg-neutral-800'
                      )}
                    >
                      <span>{item.title}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid w-72 gap-2 p-3'>
                        {item.items.map((subItem, idx) => (
                          <li key={idx}>
                            <Link
                              className={cn(
                                'flex select-none items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                pathname === subItem.link &&
                                  'bg-gray-100 text-black dark:bg-neutral-800'
                              )}
                              href={subItem.link}
                            >
                              {subItem.icon && (
                                <subItem.icon className='h-4 w-4' />
                              )}
                              <div className='text-sm'>{subItem.title}</div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <NavBarItem href={item.link} key={item.title}>
                {item.title}
              </NavBarItem>
            )
          )}
        </div>
      </div>
      {!session ? (
        <div className='flex items-center space-x-2'>
          <Link
            className={cn(buttonVariants({ variant: 'ghost' }))}
            href='/login'
          >
            로그인
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'default' }))}
            href='/signup'
          >
            회원가입
          </Link>
        </div>
      ) : (
        <div>
          <UserNav session={session} />
        </div>
      )}
    </div>
  );
};
