import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MsHeader } from "@/components/ms-header";
import { MockAnalysisHeader } from "@/components/mock-analysis-header";
import { GradeAnalysisHeader } from "@/components/grade-analysis-header";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { processSSOLogin } from "@/lib/utils/sso-helper";
import { toast } from "sonner";

function isMsPath(pathname: string): boolean {
  return pathname.startsWith("/ms");
}

function isMockAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/mock-analysis");
}

function isGradeAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/grade-analysis");
}

function RootLayout() {
  const location = useLocation();

  // SSO 코드 처리 (Hub에서 넘어온 경우)
  useEffect(() => {
    const handleSSO = async () => {
      const ssoSuccess = await processSSOLogin();
      if (ssoSuccess) {
        toast.success('Hub에서 자동 로그인되었습니다.');
      }
    };

    handleSSO();
  }, []);

  const isTestPage = location.pathname === "/test/auth-me" || location.pathname === "/test/login-debug";
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isHybridAppPage = location.pathname.startsWith("/mock-apply") ||
    location.pathname.startsWith("/score-analysis");

  const isMsMode = isMsPath(location.pathname);
  const isMockAnalysisMode = isMockAnalysisPath(location.pathname);
  const isGradeAnalysisMode = isGradeAnalysisPath(location.pathname);

  const renderHeader = () => {
    if (isTestPage || isAuthPage || isHybridAppPage) return null;
    if (isMsMode) return <MsHeader />;
    if (isMockAnalysisMode) return <MockAnalysisHeader />;
    if (isGradeAnalysisMode) return <GradeAnalysisHeader />;
    return <Header />;
  };

  return (
    <>
      {renderHeader()}
      <div className={isHybridAppPage ? "h-full min-h-screen" : "h-full min-h-screen py-4"}>
        <Outlet />
      </div>
      {!isTestPage && !isHybridAppPage && (
        <>
          <Toaster richColors position={"top-right"} duration={1200} />
          <Footer />
          <ScrollToTop />
        </>
      )}
      {isHybridAppPage && (
        <Toaster richColors position={"top-right"} duration={1200} />
      )}
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});


