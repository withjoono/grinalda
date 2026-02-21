import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Mail, User, CheckCircle2 } from "lucide-react";
// 공유 SSO 라이브러리 사용
import { isAllowedOrigin } from "@shared/sso-client";

export const Route = createFileRoute("/oauth/consent")({
  component: OAuthConsent,
});

interface ConsentParams {
  client_id: string;
  client_name: string;
  redirect_uri: string;
  scope: string;
  state: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

interface ScopeInfo {
  scope: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const SCOPE_INFO_MAP: Record<string, ScopeInfo> = {
  openid: {
    scope: "openid",
    label: "기본 인증",
    description: "안전한 로그인을 위한 기본 인증 정보",
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    required: true,
  },
  profile: {
    scope: "profile",
    label: "프로필 정보",
    description: "이름, 닉네임 등 기본 프로필 정보",
    icon: <User className="h-5 w-5 text-green-500" />,
    required: true,
  },
  email: {
    scope: "email",
    label: "이메일 주소",
    description: "계정 이메일 주소",
    icon: <Mail className="h-5 w-5 text-purple-500" />,
    required: true,
  },
};

function OAuthConsent() {
  const navigate = useNavigate();
  const [params, setParams] = useState<ConsentParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  useEffect(() => {
    // URL 파라미터 파싱
    const searchParams = new URLSearchParams(window.location.search);
    const clientId = searchParams.get("client_id");
    const clientName = searchParams.get("client_name");
    const redirectUri = searchParams.get("redirect_uri");
    const scope = searchParams.get("scope");
    const state = searchParams.get("state");
    const codeChallenge = searchParams.get("code_challenge") || undefined;
    const codeChallengeMethod =
      searchParams.get("code_challenge_method") || undefined;

    if (!clientId || !redirectUri || !scope || !state) {
      setError("잘못된 OAuth 요청입니다. 필수 파라미터가 누락되었습니다.");
      return;
    }

    const consentParams: ConsentParams = {
      client_id: clientId,
      client_name: clientName || clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    };

    setParams(consentParams);

    // 모든 스코프를 기본 선택 (필수 항목이므로)
    const scopes = scope.split(" ");
    setSelectedScopes(scopes);
  }, []);

  const handleApprove = async () => {
    if (!params) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api-nest/oauth/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함 (세션 인증용)
        body: JSON.stringify({
          client_id: params.client_id,
          redirect_uri: params.redirect_uri,
          scope: selectedScopes.join(' '), // 배열을 공백으로 구분된 문자열로 변환
          state: params.state,
          code_challenge: params.code_challenge,
          code_challenge_method: params.code_challenge_method,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "동의 처리 중 오류가 발생했습니다.");
      }

      // JSON 응답에서 리다이렉트 URL 추출
      // 응답 형식: { success: true, data: { redirectUrl: "..." } }
      const result = await response.json();
      const redirectUrl = result.data?.redirectUrl || result.redirectUrl;

      if (!redirectUrl) {
        throw new Error("리다이렉트 URL을 받지 못했습니다.");
      }

      // 보안: Open Redirect 방지를 위한 URL 검증 (공유 라이브러리 사용)
      if (!isAllowedOrigin(redirectUrl)) {
        console.error("❌ 허용되지 않은 리다이렉트 URL:", redirectUrl);
        throw new Error("허용되지 않은 리다이렉트 URL입니다.");
      }

      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setLoading(false);
    }
  };

  const handleDeny = () => {
    if (!params) return;

    // 사용자가 거부한 경우 에러와 함께 클라이언트로 리다이렉트
    const errorUrl = new URL(params.redirect_uri);
    errorUrl.searchParams.set("error", "access_denied");
    errorUrl.searchParams.set(
      "error_description",
      "사용자가 권한 요청을 거부했습니다."
    );
    errorUrl.searchParams.set("state", params.state);

    window.location.href = errorUrl.toString();
  };

  if (error && !params) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">OAuth 오류</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate({ to: "/" })}
              variant="outline"
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const scopes = params.scope.split(" ");
  const scopeInfoList = scopes
    .map((s) => SCOPE_INFO_MAP[s])
    .filter(Boolean);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl">권한 요청</CardTitle>
          </div>
          <CardDescription className="text-base">
            <span className="font-semibold text-gray-900">
              {params.client_name}
            </span>
            이(가) 귀하의 계정 정보에 접근을 요청합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              요청된 권한
            </Label>
            <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
              {scopeInfoList.map((scopeInfo) => (
                <div
                  key={scopeInfo.scope}
                  className="flex items-start gap-3 rounded-md bg-white p-3 shadow-sm"
                >
                  <div className="mt-0.5">{scopeInfo.icon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {scopeInfo.label}
                      </p>
                      {scopeInfo.required && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          필수
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {scopeInfo.description}
                    </p>
                  </div>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  안전한 연동
                </p>
                <p className="text-sm text-blue-700">
                  OAuth 2.0 + OIDC 표준 프로토콜을 사용하여 안전하게 계정을
                  연동합니다. 비밀번호는 공유되지 않습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
            <Checkbox
              id="consent-agreement"
              checked={true}
              disabled
              className="mt-0.5"
            />
            <Label
              htmlFor="consent-agreement"
              className="text-sm leading-relaxed text-gray-700"
            >
              위 권한을 {params.client_name}에 허용하는 것에 동의합니다. 언제든지
              연동을 해제할 수 있습니다.
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            onClick={handleDeny}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            거부
          </Button>
          <Button
            onClick={handleApprove}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              "허용"
            )}
          </Button>
        </CardFooter>

        <div className="border-t px-6 py-4">
          <p className="text-center text-xs text-gray-500">
            이 앱은 G Skool Hub를 통해 인증됩니다.
          </p>
        </div>
      </Card>
    </div>
  );
}
