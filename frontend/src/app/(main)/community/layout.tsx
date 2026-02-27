'use client';
import { Separator } from '@/components/ui/separator';
import { PageRoutes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { BellIcon, HelpCircleIcon, MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pageContent = {
  '/community/notice': {
    title: '공지사항',
    description: '그리날다의 공지사항을 확인하세요.',
    icon: <BellIcon className='h-full w-9' strokeWidth={1} />,
  },
  '/community/faq': {
    title: '자주묻는질문',
    description: '자주 묻는 질문들을 모아놓았습니다.',
    icon: <HelpCircleIcon className='h-full w-9' strokeWidth={1} />,
  },
  '/community/inquiry': {
    title: '1:1문의하기',
    description: '궁금한 점을 문의해주세요.',
    icon: <MessageCircleIcon className='h-full w-9' strokeWidth={1} />,
  },
};

const navItems = [
  {
    title: '공지사항',
    href: PageRoutes.COMMUNITY_NOTICE,
  },
  {
    title: '자주묻는질문',
    href: PageRoutes.COMMUNITY_FAQ,
  },
  {
    title: '1:1문의하기',
    href: PageRoutes.COMMUNITY_INQUIRY,
  },
];

const CommunityLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const content =
    pageContent[pathname as keyof typeof pageContent] ||
    pageContent['/community/notice'];

  return (
    <section className='px-6 py-12 md:px-8 lg:py-20'>
      <div className='container mx-auto'>
        <div className='relative mx-auto flex max-w-screen-xl flex-col gap-8 lg:flex-row lg:gap-20'>
          <header className='top-32 flex h-fit w-full flex-col items-center gap-5 text-center lg:sticky lg:w-full lg:max-w-80 lg:items-start lg:gap-8 lg:text-left'>
            <div className='flex items-center gap-2'>
              {content.icon}
              <h1 className='text-4xl font-extrabold'>{content.title}</h1>
            </div>
            <p className='text-muted-foreground lg:text-xl'>
              {content.description}
            </p>
            <Separator />
            <nav className='w-full'>
              <ul className='flex w-full flex-wrap items-center justify-center gap-4 lg:flex-col lg:items-start lg:gap-2'>
                {navItems.map((item) => (
                  <li key={item.href} className='w-full'>
                    <Link
                      href={item.href}
                      className={cn(
                        'block w-full rounded-md px-4 py-2 transition-colors hover:bg-accent/50 hover:text-primary',
                        pathname.includes(item.href)
                          ? 'bg-accent font-medium text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          {children}
        </div>
      </div>
    </section>
  );
};

export default CommunityLayout;
