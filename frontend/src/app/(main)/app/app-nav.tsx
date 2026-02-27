'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UploadIcon,
  BarChart3Icon,
  BookOpenIcon,
  SearchIcon,
  StarIcon,
} from 'lucide-react';
import { PageRoutes } from '@/constants/routes';

const sidebarNavItems = [
  {
    title: '메인',
    href: PageRoutes.APP_MAIN,
    icon: HomeIcon,
  },
  {
    title: '입력',
    href: PageRoutes.APP_INPUT_UPLOAD,
    icon: UploadIcon,
    children: [
      { title: '업로드', href: PageRoutes.APP_INPUT_UPLOAD },
    ],
  },
  {
    title: '교과분석',
    href: PageRoutes.APP_SUBJECT_ANALYSIS,
    icon: BarChart3Icon,
    children: [
      { title: '교과성적분석', href: PageRoutes.APP_SUBJECT_ANALYSIS },
    ],
  },
  {
    title: '비교과분석',
    href: PageRoutes.APP_SETUK,
    icon: BookOpenIcon,
    children: [
      { title: '세특', href: PageRoutes.APP_SETUK },
      { title: '창체·행특', href: PageRoutes.APP_CREATIVE_ACTIVITY },
    ],
  },
  {
    title: '전형탐색',
    href: PageRoutes.APP_EXPLORE,
    icon: SearchIcon,
  },
  {
    title: '모의지원',
    href: PageRoutes.APP_BOOKMARK,
    icon: StarIcon,
  },
];

export default function AppNav() {
  const pathname = usePathname();

  const isActive = (item: (typeof sidebarNavItems)[0]) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <div>
      {/* 데스크탑 */}
      <div className='hidden max-w-[100vw-4rem] overflow-x-auto md:block'>
        <div className='mx-auto flex w-fit justify-center gap-1 border-b'>
          {sidebarNavItems.map((item) => (
            <div key={item.href} className='group relative'>
              <Link
                href={item.href}
                className={cn(
                  '-mb-px flex flex-col items-center gap-1.5 px-3 pb-3.5',
                  isActive(item)
                    ? 'border-b-2 border-primary'
                    : 'cursor-pointer border-b-2 border-transparent'
                )}
              >
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-md bg-muted transition-colors duration-300',
                    isActive(item) && 'bg-primary text-background'
                  )}
                >
                  {item.icon && <item.icon className='w-6' />}
                </span>
                <p className='text-xs text-muted-foreground'>{item.title}</p>
              </Link>
              {/* 드롭다운 서브메뉴 */}
              {item.children && item.children.length > 0 && (
                <div className='invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
                  <div className='min-w-[140px] rounded-lg border bg-background p-1.5 shadow-lg'>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted',
                          pathname === child.href
                            ? 'font-semibold text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* 모바일 */}
      <div className='md:hidden'>
        <div className='mx-auto grid w-full grid-cols-3 gap-2 border-b pb-4'>
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-lg bg-muted p-2.5',
                isActive(item) && 'bg-primary text-background'
              )}
            >
              {item.icon && <item.icon className='w-5' />}
              <p className='text-sm'>{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
