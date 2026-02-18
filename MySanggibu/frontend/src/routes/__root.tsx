import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MsHeader } from "@/components/ms-header";
import { MockAnalysisHeader } from "@/components/mock-analysis-header";
import { GradeAnalysisHeader } from "@/components/grade-analysis-header";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const [isSSOLoading, setIsSSOLoading] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !!params.get('sso_code');
  });

  // SSO 코드 처리 (Hub에서 넘어온 경우)
  useEffect(() => {
    const handleSSO = async () => {
      const ssoSuccess = await processSSOLogin();
      if (ssoSuccess) {
        toast.success('Hub에서 자동 로그인되었습니다.');
        // 토큰 저장 후 페이지를 새로고침하여 모든 컴포넌트가 로그인 상태로 렌더링
        setTimeout(() => window.location.reload(), 500);
      }
      setIsSSOLoading(false);
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
      {isSSOLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            animation: 'spin 1.2s linear infinite',
          }}>⏳</div>
          <p style={{
            fontSize: '1.1rem',
            color: '#374151',
            fontWeight: 500,
          }}>자동 로그인 중입니다...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
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


