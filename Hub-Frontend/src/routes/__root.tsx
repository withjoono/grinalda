import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JungsiHeader } from "@/components/jungsi-header";
import { SusiHeader } from "@/components/susi-header";
import { MockAnalysisHeader } from "@/components/mock-analysis-header";
import { GradeAnalysisHeader } from "@/components/grade-analysis-header";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
// SSO 초기화
import { useSSOInit } from "@shared/sso-client/hooks";
import { setTokens as setTokensToManager } from "@/lib/api/token-manager";
import { useTokenStore } from "@/stores/atoms/tokens";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { useState } from "react";

function isJungsiPath(pathname: string): boolean {
  return pathname.startsWith("/jungsi") || pathname.startsWith("/j");
}

function isSusiPath(pathname: string): boolean {
  return pathname.startsWith("/susi");
}

function isMockAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/mock-analysis");
}

function isGradeAnalysisPath(pathname: string): boolean {
  return pathname.startsWith("/grade-analysis");
}

function RootLayout() {
  const location = useLocation();
  const isTestPage = location.pathname === "/test/auth-me" || location.pathname === "/test/login-debug";
  const isAuthPage = location.pathname.startsWith("/auth/");
  const isHybridAppPage = location.pathname.startsWith("/mock-apply") ||
    location.pathname.startsWith("/score-analysis");

  // SSO 자동 로그인 로딩 상태
  const [isSSOLoading, setIsSSOLoading] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !!(params.get('sso_access_token') || params.get('access_token') || params.get('sso_code'));
  });

  // SSO 토큰 초기화 (URL 파라미터에서 토큰 확인)
  const { setTokens: setTokenStoreTokens } = useTokenStore();
  const { setTokens: setAuthStoreTokens } = useAuthStore();

  useSSOInit((tokens) => {
    console.log('🔐 SSO 토큰 수신 - 자동 로그인 처리');
    // token-manager에 저장 (single source of truth)
    setTokensToManager(tokens.accessToken, tokens.refreshToken);
    // Zustand 스토어들 동기화
    setTokenStoreTokens(tokens.accessToken, tokens.refreshToken);
    setAuthStoreTokens(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.tokenExpiry ?? Math.floor(Date.now() / 1000) + 7200
    );
    setIsSSOLoading(false);
  });

  // SSO 파라미터가 없었다면 로딩 해제 (타이머 대비)
  // useSSOInit 콜백이 호출되지 않는 경우 (토큰 없음) 이미 false

  const isJungsiMode = isJungsiPath(location.pathname);
  const isSusiMode = isSusiPath(location.pathname);
  const isMockAnalysisMode = isMockAnalysisPath(location.pathname);
  const isGradeAnalysisMode = isGradeAnalysisPath(location.pathname);

  const renderHeader = () => {
    // 메인 페이지는 자체 헤더(service-cards-page.tsx)를 사용하므로 글로벌 헤더 숨김
    if (location.pathname === "/") return null;
    if (isTestPage || isAuthPage || isHybridAppPage) return null;
    if (isJungsiMode) return <JungsiHeader />;
    if (isSusiMode) return <SusiHeader />;
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
