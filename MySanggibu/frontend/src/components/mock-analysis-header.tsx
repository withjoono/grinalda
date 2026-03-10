import { IconChevronDown } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "./custom/button";
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
import { useQuery } from "@tanstack/react-query";
import { USER_API } from "@/stores/server/features/me/apis";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, LayoutGrid, Bell, Users } from "lucide-react";
import { WonCircle } from "./icons";
import { clearTokens as clearTokenManager } from "@/lib/api/token-manager";
import { useTokenStore } from "@/stores/atoms/tokens";
import { logoutFetch } from "@/stores/server/features/auth/apis";

/**
 * 모의고사 분석 서비스 전용 헤더
 * - 모의고사 분석 관련 메뉴만 표시
 * - "전체 서비스로 돌아가기" 버튼 제공
 */
export const MockAnalysisHeader = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isLoginPage = window.location.pathname === "/auth/login";
  const isTestPage = window.location.pathname === "/test/auth-me";
  const isRegisterPage = window.location.pathname === "/auth/register";
  const isResetPasswordPage = window.location.pathname === "/auth/reset-password";
  const isAuthPage = isLoginPage || isTestPage || isRegisterPage || isResetPasswordPage;

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: USER_API.fetchCurrentUserAPI,
    enabled: !isAuthPage,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { clearTokens } = useAuthStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogoutClick = async () => {
    try {
      // 1. Hub 서버에 로그아웃 API 호출
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutFetch(refreshToken);
      }
    } catch (error) {
      console.warn('⚠️ Hub 로그아웃 API 실패 (로컬 로그아웃 계속 진행):', error);
    }

    // 2. 로컬 토큰 및 상태 초기화
    clearTokens();
    clearTokenManager();
    useTokenStore.getState().clearTokens();
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    toast.success("안녕히 가세요 👋");
    window.location.href = '/auth/login';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto">
        <div className="container flex h-14 w-screen items-center justify-between lg:h-16">
          {/* 로고 */}
          <Link to="/mock-analysis/score-input" className="flex shrink-0 items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-auto w-10 lg:w-12" />
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 lg:text-lg">
                모의고사 분석
              </span>
              <span className="text-[10px] text-indigo-600 lg:text-xs">
                T Skool
              </span>
            </div>
          </Link>

          {/* 모바일 메뉴 */}
          <span className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex h-5 w-5 text-gray-600 lg:hidden"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent
                side={"left"}
                className="w-[300px] overflow-y-auto bg-white sm:w-[400px]"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-gray-900">
                    <img
                      src="/logo.png"
                      alt="logo"
                      className="h-auto w-10 lg:w-12"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-base font-bold">모의고사 분석</span>
                      <span className="text-xs text-indigo-600">T Skool</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col items-start justify-center gap-2">
                  {/* 전체 서비스 아이콘 */}
                  <a
                    href={import.meta.env.VITE_HUB_URL || "http://localhost:5000"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "mb-4 text-primary hover:bg-primary/10",
                    )}
                    title="전체 서비스"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </a>

                  <Separator className="mb-2 bg-gray-200" />

                  {/* 서비스 이용 순서 */}
                  <div className="w-full space-y-1">
                    <div className="px-1 py-2 text-sm font-semibold text-indigo-600">
                      서비스 이용 순서
                    </div>
                    <Link
                      to="/mock-analysis/score-input"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-2 px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                        1
                      </span>
                      📝 성적입력
                    </Link>
                    <Link
                      to="/mock-analysis/score-analysis"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-2 px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                        2
                      </span>
                      📊 성적분석
                    </Link>
                    <Link
                      to="/mock-analysis/prediction"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-2 px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                        3
                      </span>
                      🎯 대학예측
                    </Link>
                  </div>

                  <Separator className="my-2 bg-gray-200" />

                  <div className="w-full space-y-1">
                    <div className="px-1 py-2 text-sm font-semibold text-indigo-600">
                      추가 분석
                    </div>
                    <Link
                      to="/mock-analysis/statistics"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      📈 누적분석
                    </Link>
                    <Link
                      to="/mock-analysis/wrong-answers"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      ❌ 분석과오답
                    </Link>
                    <Link
                      to="/mock-analysis/target-university"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      🏫 목표대학
                    </Link>
                  </div>

                  <Separator className="my-2 bg-gray-200" />

                  {/* 사용자 메뉴 */}
                  <div className="w-full space-y-2">
                    <Link
                      to="/products"
                      className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-primary hover:bg-primary/10",
                    )}
                    title="이용권 구매"
                      onClick={() => setIsOpen(false)}
                    >
                      <WonCircle className="h-6 w-6" />
                      
                    </Link>
                    <Link
                      to="/mock-analysis/notifications"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-2 px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Bell className="h-4 w-4" />
                      알림 설정
                    </Link>
                    <Link
                      to="/account-linkage"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-start gap-2 px-1 text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      계정연동
                    </Link>
                    {user ? (
                      <>
                        <Link
                          to="/users/profile"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start px-1 text-gray-700 hover:bg-gray-100",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          마이 페이지
                        </Link>
                        <Link
                          to="/users/mock-exam"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start px-1 text-gray-700 hover:bg-gray-100",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          모의고사 성적 관리
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleLogoutClick();
                            setIsOpen(false);
                          }}
                          className={cn(
                            "w-full justify-start px-1 text-red-500 hover:bg-gray-100 hover:text-red-500",
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
                          "w-full rounded-full bg-indigo-600 hover:bg-indigo-700",
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
          <div className="hidden items-center gap-8 lg:flex xl:gap-12">
            <NavigationMenu>
              <NavigationMenuList>
                {/* 전체 서비스 아이콘 */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-primary hover:bg-primary/10",
                    )}
                    asChild
                  >
                    <a
                      href={import.meta.env.VITE_HUB_URL || "http://localhost:5000"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="전체 서비스"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 성적 관리 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100"
                    onPointerMove={(e: React.PointerEvent<HTMLButtonElement>) => e.preventDefault()}
                    onPointerLeave={(e: React.PointerEvent<HTMLButtonElement>) => e.preventDefault()}
                  >
                    성적 관리
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 md:w-[400px]">
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/mock-analysis/score-input"
                          className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                            1
                          </span>
                          <div>
                            <div className="text-sm font-medium">📝 성적입력</div>
                            <div className="text-xs text-muted-foreground">
                              모의고사 성적을 입력합니다
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/mock-analysis/score-analysis"
                          className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                            2
                          </span>
                          <div>
                            <div className="text-sm font-medium">📊 성적분석</div>
                            <div className="text-xs text-muted-foreground">
                              입력된 성적을 분석합니다
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/mock-analysis/prediction"
                          className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                            3
                          </span>
                          <div>
                            <div className="text-sm font-medium">🎯 대학예측</div>
                            <div className="text-xs text-muted-foreground">
                              예상 대학을 확인합니다
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 추가 분석 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100"
                    onPointerMove={(e: React.PointerEvent<HTMLButtonElement>) => e.preventDefault()}
                    onPointerLeave={(e: React.PointerEvent<HTMLButtonElement>) => e.preventDefault()}
                  >
                    추가 분석
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 md:w-[350px]">
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/mock-analysis/statistics"
                          className="flex items-center gap-2 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="text-sm font-medium">📈 누적분석</span>
                        </Link>
                        <Link
                          to="/mock-analysis/wrong-answers"
                          className="flex items-center gap-2 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="text-sm font-medium">❌ 분석과오답</span>
                        </Link>
                        <Link
                          to="/mock-analysis/target-university"
                          className="flex items-center gap-2 rounded-lg px-3 py-3 hover:bg-accent"
                        >
                          <span className="text-sm font-medium">🏫 목표대학</span>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* 우측 메뉴 */}
            <div className="flex items-center gap-1">
              {/* 이용권 구매 아이콘 */}
              <Link
                to="/products"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "text-primary hover:bg-primary/10",
                )}
                title="이용권 구매"
              >
                <WonCircle className="h-6 w-6" />
              </Link>

              {/* 알림 아이콘 */}
              <Link
                to="/mock-analysis/notifications"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
                title="알림 설정"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Link>

              {/* 계정연동 아이콘 */}
              <Link
                to="/account-linkage"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
                title="계정연동"
              >
                <Users className="h-5 w-5" />
              </Link>

              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
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
                      to="/users/mock-exam"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      모의고사 성적 관리
                    </Link>
                    <Link
                      to="/users/payment"
                      className="flex h-8 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100"
                    >
                      결제내역
                    </Link>
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
                <Link
                  to="/auth/login"
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-indigo-600 hover:bg-indigo-700",
                  )}
                >
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
