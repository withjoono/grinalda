import { IconChevronDown } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "./custom/button";
import headerLogo from "@/assets/icon/header-logo.png";
// import headerLogo2 from "@/assets/icon/header-logo2.png";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useCheckOfficer } from "@/stores/server/features/susi/evaluation/queries";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";

export const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Queries
  const { data: user } = useGetCurrentUser();
  const { data: isOfficer } = useCheckOfficer();

  // Zustand
  const { clearTokens } = useAuthStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogoutClick = () => {
    clearTokens();
    queryClient.clear();
    toast.success("안녕히 가세요 👋");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-[1px] bg-white">
      <div className="mx-auto">
        <div className="container flex h-14 w-screen items-center justify-between lg:h-16">
          {/* 로고 */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src={headerLogo} alt="logo" className="h-auto w-10 lg:w-12" />
            <div className="text-base font-medium text-primary lg:text-lg">
              거북스쿨
            </div>
          </Link>

          {/* mobile */}
          <span className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex h-5 w-5 lg:hidden"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent
                side={"left"}
                className="w-[300px] overflow-y-auto sm:w-[400px]"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <img
                      src={headerLogo}
                      alt="logo"
                      className="h-auto w-10 lg:w-12"
                    />
                    <div className="text-base font-medium text-primary lg:text-lg">
                      거북스쿨
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col items-start justify-center gap-4">
                  <Link
                    to="/"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start px-1",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    🏠 메인
                  </Link>

                  <div className="space-y-6">
                    <div className="w-full space-y-4">
                      <h3 className="mb-2 font-semibold">사정관 평가</h3>
                      <div className="grid grid-cols-2 gap-2 gap-y-6 text-sm">
                        <Link to="/evaluation" onClick={() => setIsOpen(false)}>
                          💁 사용안내
                        </Link>
                        <Link
                          to="/evaluation/compatibility"
                          onClick={() => setIsOpen(false)}
                        >
                          🌏 계열 적합성 진단
                        </Link>
                        <Link
                          to="/evaluation/request"
                          onClick={() => setIsOpen(false)}
                        >
                          🧑‍🏫 사정관 평가 신청
                        </Link>
                        <Link
                          to="/evaluation/list"
                          onClick={() => setIsOpen(false)}
                        >
                          📊 사정관 평가 내역
                        </Link>
                        <Link
                          to="/evaluation/self"
                          onClick={() => setIsOpen(false)}
                        >
                          📋 자가평가
                        </Link>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <h3 className="mb-2 font-semibold">수시 서비스</h3>
                      <div className="grid grid-cols-2 gap-2 gap-y-6 text-sm">
                        <Link to="/susi" onClick={() => setIsOpen(false)}>
                          💁 사용안내
                        </Link>
                        <Link
                          to="/susi/subject"
                          onClick={() => setIsOpen(false)}
                        >
                          📚 교과 전형 탐색
                        </Link>
                        <Link
                          to="/susi/comprehensive"
                          onClick={() => setIsOpen(false)}
                        >
                          🧐 학종 전형 탐색
                        </Link>
                        <Link
                          to="/susi/nonsul"
                          onClick={() => setIsOpen(false)}
                        >
                          📝 논술 전형 탐색
                        </Link>
                        <Link
                          to="/susi/interest"
                          onClick={() => setIsOpen(false)}
                        >
                          🏫 관심대학 및 모의지원
                        </Link>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <h3 className="mb-2 font-semibold">정시 서비스</h3>
                      <div className="grid grid-cols-2 gap-2 gap-y-6 text-sm">
                        <Link to="/jungsi" onClick={() => setIsOpen(false)}>
                          💁 사용안내
                        </Link>
                        <Link to="/jungsi/a" onClick={() => setIsOpen(false)}>
                          🐢 가군 컨설팅
                        </Link>
                        <Link to="/jungsi/b" onClick={() => setIsOpen(false)}>
                          🐢 나군 컨설팅
                        </Link>
                        <Link to="/jungsi/c" onClick={() => setIsOpen(false)}>
                          🐢 다군 컨설팅
                        </Link>
                        <Link
                          to="/jungsi/interest"
                          onClick={() => setIsOpen(false)}
                        >
                          🏫 관심대학 및 모의지원
                        </Link>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <h3 className="mb-2 font-semibold">분석 서비스</h3>
                      <div className="grid grid-cols-2 gap-2 gap-y-6 text-sm">
                        <Link to="/analysis" onClick={() => setIsOpen(false)}>
                          💁 사용안내
                        </Link>
                        <Link
                          to="/analysis/comparison"
                          onClick={() => setIsOpen(false)}
                        >
                          👻 수시/정시 지원전략
                        </Link>
                        <Link
                          to="/analysis/performance"
                          onClick={() => setIsOpen(false)}
                          disabled
                        >
                          🧐 성적 분석
                        </Link>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <h3 className="mb-2 font-semibold">고객센터</h3>
                      <div className="grid grid-cols-2 gap-2 gap-y-6 text-sm">
                        <Link
                          to="/official/notice"
                          onClick={() => setIsOpen(false)}
                        >
                          공지사항
                        </Link>
                        <Link
                          to="/official/guide"
                          onClick={() => setIsOpen(false)}
                        >
                          서비스 소개
                        </Link>
                        <Link
                          to="/official/faq"
                          onClick={() => setIsOpen(false)}
                        >
                          FAQ
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />
                  <div className="w-full space-y-2">
                    <Link
                      to="/products"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start px-1",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      🔥 이용권 구매
                    </Link>
                    {user ? (
                      <>
                        <Link
                          to="/users/profile"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start px-1",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          마이 페이지
                        </Link>
                        <Link
                          to="/users/school-record"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start px-1",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          생기부/성적 입력
                        </Link>
                        <Link
                          to="/users/mock-exam"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start px-1",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          모의고사/수능 성적 입력
                        </Link>
                        {isOfficer && (
                          <Link
                            to="/officer/apply"
                            className={cn(
                              buttonVariants({ variant: "ghost" }),
                              "w-full justify-start px-1",
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            평가자 전용 페이지
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleLogoutClick();
                            setIsOpen(false);
                          }}
                          className={cn(
                            "w-full justify-start px-1 text-red-500 hover:text-red-600",
                          )}
                        >
                          로그아웃
                        </Button>
                      </>
                    ) : (
                      <Link
                        to="/auth/login"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        로그인
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* 데스크탑 메뉴 */}
          <div className="hidden items-center gap-12 lg:flex xl:gap-20">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link to="/">홈</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onPointerMove={(e: any) => e.preventDefault()}
                    onPointerLeave={(e: any) => e.preventDefault()}
                  >
                    사정관 평가
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-start rounded-md p-2 no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:shadow-md"
                            to="/evaluation"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              💁 사용안내
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              자세한 사용방법과 QNA를 확인하려면 클릭해주세요.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="/evaluation/compatibility"
                        title="🌏 계열 적합성 진단"
                      >
                        생기부 평가를 신청하기 전, 내가 어떤 계열에 적합한지
                        미리 탐색해보세요.
                      </ListItem>
                      <ListItem
                        href="/evaluation/request"
                        title="🧑‍🏫 사정관 평가 신청"
                      >
                        전공별 전문 선생님이 학생 생기부와 자소서를 보고 직접
                        꼼꼼하게 평가합니다.
                      </ListItem>
                      <ListItem
                        href="/evaluation/list"
                        title="📊 사정관 평가 내역"
                      >
                        완료된 평가 보고서 목록입니다.
                      </ListItem>
                      <ListItem href="/evaluation/self" title="📋 자가평가">
                        학종 탐색을 위해 스스로 생기부를 평가합니다.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onPointerMove={(e: any) => e.preventDefault()}
                    onPointerLeave={(e: any) => e.preventDefault()}
                  >
                    수시 서비스
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="z grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-start rounded-md p-2 no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:shadow-md"
                            to="/susi"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              💁 사용안내
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              자세한 사용방법과 QNA를 확인하려면 클릭해주세요.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/susi/subject" title="📚 교과 전형 탐색">
                        내 모의고사/수능 성적으로 나에게 적합한 대학을
                        탐색해보세요!
                      </ListItem>
                      <ListItem
                        href="/susi/comprehensive"
                        title="🧐 학종 전형 탐색"
                      >
                        평가 완료된 보고서를 바탕으로 나에게 적합한 대학을
                        탐색해보세요!
                      </ListItem>
                      <ListItem href="/susi/nonsul" title="📝 논술 전형 탐색">
                        나의 내신에 유리한 논술 전형을 탐색해보세요!
                      </ListItem>
                      <ListItem
                        href="/susi/interest"
                        title="🏫 관심대학 및 모의지원"
                      >
                        관심 대학의 유불리 분석 보고서를 확인하고 최적화된
                        조합을 찾아보세요!
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onPointerMove={(e: any) => e.preventDefault()}
                    onPointerLeave={(e: any) => e.preventDefault()}
                  >
                    정시 서비스
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="z grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-start rounded-md p-2 no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:shadow-md"
                            to="/jungsi"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              💁 사용안내
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              9월 모의평가, <br /> 정시 시뮬레이션 <br />
                              (국내 유일)
                            </p>
                            <p className="pt-4 text-sm leading-tight text-muted-foreground">
                              자세한 사용방법과 QNA를 확인하려면 클릭해주세요.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/jungsi/a" title="🐢 가군 컨설팅">
                        정시 가군 전형을 탐색해보세요.
                      </ListItem>
                      <ListItem href="/jungsi/b" title="🐢 나군 컨설팅">
                        정시 나군 전형을 탐색해보세요.
                      </ListItem>
                      <ListItem href="/jungsi/c" title="🐢 다군 컨설팅">
                        정시 다군 전형을 탐색해보세요.
                      </ListItem>
                      <ListItem
                        href="/jungsi/interest"
                        title="관심대학 및 모의지원"
                      >
                        🏫 관심 대학의 유불리 분석 보고서를 확인하고 최적화된
                        조합을 찾아보세요!
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onPointerMove={(e: any) => e.preventDefault()}
                    onPointerLeave={(e: any) => e.preventDefault()}
                  >
                    분석 서비스
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="z grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-start rounded-md p-2 no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:shadow-md"
                            to="/analysis"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              💁 사용안내
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              자세한 사용방법과 QNA를 확인하려면 클릭해주세요.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="/analysis/comparison"
                        title="👻 수시/정시 지원전략"
                      >
                        수시/정시 중 어떤게 유리할지 비교해보세요!
                      </ListItem>
                      <ListItem
                        href="/analysis/performance"
                        title="🧐 성적 분석"
                      >
                        내 성적을 한눈에 파악해보세요!
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"}>
                    <span>고객센터</span>
                    <IconChevronDown className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 space-y-1 p-1">
                  <Link
                    to="/official/notice"
                    className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                  >
                    공지사항
                  </Link>
                  <Link
                    to="/official/guide"
                    className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                  >
                    서비스 소개
                  </Link>
                  <Link
                    to="/official/faq"
                    className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                  >
                    FAQ
                  </Link>
                </PopoverContent>
              </Popover>
              <Link
                to="/products"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "px-3 py-1 text-sm",
                )}
              >
                🔥 이용권 구매
              </Link>

              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"ghost"}>
                      <span>{user.nickname} 님</span>{" "}
                      <IconChevronDown className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 space-y-1 p-1">
                    <Link
                      to="/users/profile"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      마이 페이지
                    </Link>
                    <Link
                      to="/users/school-record"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      생기부/성적 입력
                    </Link>
                    <Link
                      to="/users/mock-exam"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      모의고사/수능 성적 입력
                    </Link>
                    <Link
                      to="/users/payment"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      결제내역
                    </Link>
                    {isOfficer && (
                      <Link
                        to="/officer/apply"
                        className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                      >
                        평가자 전용 페이지
                      </Link>
                    )}
                    <Separator />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="flex h-8 w-full items-center justify-start rounded-md px-2 text-sm font-normal text-red-500 hover:bg-gray-100 hover:text-red-500"
                        >
                          로그아웃
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-[300px]">
                        <DialogHeader>
                          <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
                        </DialogHeader>
                        <DialogFooter className="gap-4">
                          <DialogClose>취소</DialogClose>
                          <Button onClick={handleLogoutClick}>확인</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link to="/auth/login" className={cn(buttonVariants())}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem = ({
  className,
  title,
  children,
  href,
  disabled,
}: {
  className?: string;
  title: string;
  children?: React.ReactNode;
  disabled?: boolean;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          disabled={disabled}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
ListItem.displayName = "ListItem";
