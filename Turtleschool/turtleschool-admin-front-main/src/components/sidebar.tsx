import { useEffect, useState } from 'react';
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import Nav from './nav';
import { sidelinks } from '@/config/nav-config';
import { Button } from './custom/button';
import { Layout, LayoutHeader } from './custom/layout';
import HeaderLogo from '../assets/header-logo.svg?react';

// SidebarProps 인터페이스 정의
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean; // 사이드바가 접혀 있는지 여부
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>; // 사이드바의 상태를 변경하는 함수
}

// Sidebar 컴포넌트 정의
export default function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);

  // navOpened 상태에 따라 body의 스크롤을 제어
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [navOpened]);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className
      )}
    >
      {/* 모바일에서의 오버레이 */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* 헤더 */}
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <HeaderLogo className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`} />

            <div
              className={`flex flex-col pl-4 justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className="font-medium">거북 스쿨</span>
              <span className="text-xs">어드민 페이지</span>
            </div>
          </div>

          {/* 모바일에서의 토글 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </LayoutHeader>

        {/* 네비게이션 링크 */}
        <Nav
          id="sidebar-menu"
          className={`h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* 사이드바 너비 토글 버튼 */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft stroke={1.5} className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </Layout>
    </aside>
  );
}
