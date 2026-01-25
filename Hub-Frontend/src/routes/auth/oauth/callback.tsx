import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { useTokenStore } from "@/stores/atoms/tokens";
import { setTokens as setTokensToManager } from "@/lib/api/token-manager";
import { toast } from "sonner";
// 공유 SSO 라이브러리 사용
import { extractTokensFromUrl, validateToken } from "@shared/sso-client";

export const Route = createFileRoute("/auth/oauth/callback")({
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const { setTokens: setAuthStoreTokens } = useAuthStore();
  const { setTokens: setTokenStoreTokens } = useTokenStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // StrictMode에서 중복 실행 방지
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // 공유 라이브러리로 URL에서 토큰 추출 (자동으로 URL에서 제거됨)
    const tokens = extractTokensFromUrl({
      removeFromUrl: true,
      debug: true,
    });

    if (!tokens) {
      console.error('❌ OAuth 콜백: 토큰 정보 누락');
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate({ to: '/auth/login' });
      return;
    }

    // 토큰 검증
    const validation = validateToken(tokens.accessToken);
    if (!validation.isValid) {
      console.error(`❌ OAuth 콜백: 토큰 검증 실패 - ${validation.error}`);
      toast.error('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      navigate({ to: '/auth/login' });
      return;
    }

    console.log('✅ OAuth 콜백: 토큰 검증 성공', {
      accessTokenLength: tokens.accessToken.length,
      refreshTokenLength: tokens.refreshToken.length,
      tokenExpiry: tokens.tokenExpiry,
    });

    // token-manager에 저장 (single source of truth)
    setTokensToManager(tokens.accessToken, tokens.refreshToken);

    // Zustand 스토어들 동기화
    setTokenStoreTokens(tokens.accessToken, tokens.refreshToken);
    setAuthStoreTokens(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.tokenExpiry ?? Math.floor(Date.now() / 1000) + 7200
    );

    toast.success('환영합니다. 거북스쿨입니다.');

    // 메인 페이지로 리다이렉트
    navigate({ to: '/' });
  }, [navigate, setAuthStoreTokens, setTokenStoreTokens]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
