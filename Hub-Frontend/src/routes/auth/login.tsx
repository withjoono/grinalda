import { GoogleLoginButton } from "@/components/login-google-button";
import { LoginWithEmailForm } from "@/components/login-with-email-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasTokens, getAccessToken } from "@/lib/api/token-manager";
import { getSSOServiceId } from "@/lib/utils/sso-helper";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  useEffect(() => {
    // 이미 로그인된 상태에서 redirect_uri가 있으면 자동 SSO 리다이렉트
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect") || searchParams.get("redirect_uri");

    if (!redirectUrl || !hasTokens()) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    setIsAutoRedirecting(true);

    // SSO 코드 생성 후 리다이렉트
    const autoRedirect = async () => {
      try {
        const serviceId = getSSOServiceId(redirectUrl) || 'unknown';

        const response = await fetch('/api-hub/auth/sso/generate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ targetService: serviceId }),
        });

        const data = await response.json();

        if (response.ok && (data.success !== false)) {
          const ssoCode = data.data?.code || data.code;
          if (ssoCode) {
            const targetUrl = new URL(redirectUrl);
            targetUrl.searchParams.set('sso_code', ssoCode);
            console.log('✅ 자동 SSO 리다이렉트:', targetUrl.origin);
            window.location.href = targetUrl.toString();
            return;
          }
        }
      } catch (error) {
        console.error('❌ 자동 SSO 리다이렉트 실패:', error);
      }

      // SSO 실패 시 그냥 redirect_uri로 이동
      setIsAutoRedirecting(false);
    };

    autoRedirect();
  }, []);

  // 자동 리다이렉트 중이면 로딩 표시
  if (isAutoRedirecting) {
    return (
      <div className="w-full">
        <div className="mx-auto w-full max-w-screen-xl px-4">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-pulse text-muted-foreground">
              로그인 확인 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-full sm:max-w-[400px]">
            <div className="flex flex-col items-center space-y-2 pb-8">
              <h3 className="text-xl font-medium sm:text-2xl">로그인</h3>
              <p className="text-sm text-muted-foreground">
                이메일 또는 Google 계정으로 로그인하세요
              </p>
            </div>
            <div className="space-y-4">
              {/* 이메일/비밀번호 로그인 */}
              <LoginWithEmailForm />

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    또는
                  </span>
                </div>
              </div>

              {/* 구글 로그인 */}
              <GoogleLoginButton />

              <div className="text-center text-sm">
                <span className="text-muted-foreground">계정이 없으신가요? </span>
                <Link
                  to="/auth/register"
                  className="font-medium text-primary hover:underline"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
