import { Button } from "./custom/button";
import googleIcon from "@/assets/icon/login-google.png";
import { signInWithPopup } from "firebase/auth";
import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { auth, provider } from "@/lib/utils/firebase/firebase";
import { setTokens } from "@/lib/api/token-manager";

interface Props {
  isPending?: boolean;
  buttonText?: string;
}

export const GoogleLoginButton = ({ isPending, buttonText = "구글 로그인" }: Props) => {
  const setData = useSocialSignUp((state) => state.setData);
  const navigate = useNavigate();
  const user = useGetCurrentUser();

  const handleGoogleLoginClick = async () => {
    try {
      // 1. Firebase Google 로그인
      const result = await signInWithPopup(auth, provider);

      // 2. Firebase ID 토큰 가져오기
      const idToken = await result.user.getIdToken();

      // 3. Firebase 토큰으로 백엔드 로그인
      const hubApiUrl = import.meta.env.VITE_API_URL_HUB || 'http://localhost:4000';
      const response = await fetch(`${hubApiUrl}/auth/firebase/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const loginData = await response.json();

      // 404: 신규 사용자 (회원가입 필요)
      if (response.status === 404) {
        // Google 로그인 정보를 저장하고 회원가입 페이지로 이동
        setData({
          socialType: 'google',
          token: idToken,
          email: result.user.email || null,
          name: result.user.displayName || null,
        });
        toast.warning("🎓 회원가입이 필요합니다.\n추가 정보를 입력해주세요.", {
          duration: 6000,
        });
        navigate({ to: "/auth/register" });
        return;
      }

      if (!response.ok) {
        throw new Error(loginData.error || '로그인 실패');
      }

      if (loginData.success) {
        const { accessToken, refreshToken } = loginData.data;

        // 1. 사용자 정보 조회 (Role 확인용)
        try {
          // env.apiUrlHub 사용 (import 필요)
          // 만약 env가 import되지 않았다면 상단에 추가해야 함. 
          // 여기서는 /api-hub 프록시 대신 env 직접 사용 권장 (일관성)
          const meResponse = await fetch(`${import.meta.env.VITE_API_URL_HUB || 'http://localhost:4000'}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const meData = await meResponse.json();
          const memberType = meData.member_type; // 'student', 'teacher', 'parent'

          // 2. 선생님/학부모일 경우: 해당 Admin으로 바로 SSO 리다이렉트
          if (memberType === 'teacher' || memberType === 'parent') {
            const teacherAdminUrl = import.meta.env.VITE_TEACHERADMIN_URL || 'http://localhost:3020';
            const parentAdminUrl = import.meta.env.VITE_PARENTADMIN_URL || 'http://localhost:3019';
            const hubApiUrl = import.meta.env.VITE_API_URL_HUB || 'http://localhost:4000';

            const targetService = memberType === 'teacher' ? 'teacheradmin' : 'parentadmin';
            const targetUrlBase = memberType === 'teacher' ? teacherAdminUrl : parentAdminUrl;

            const ssoResponse = await fetch(`${hubApiUrl}/auth/sso/generate-code`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ targetService }),
            });
            const ssoData = await ssoResponse.json();

            if (ssoResponse.ok && (ssoData.success || ssoData.code)) {
              const code = ssoData.data?.code || ssoData.code;
              const redirectUrl = new URL(targetUrlBase);
              redirectUrl.searchParams.set('sso_code', code);

              toast.success(`${memberType === 'teacher' ? '선생님' : '학부모'} 앱으로 이동합니다.`);
              window.location.href = redirectUrl.toString();
              return; // 여기서 함수 종료 (Hub 토큰 저장 안 함)
            }
          }
        } catch (meError) {
          console.error("Failed to fetch user info:", meError);
        }

        // 3. 학생(또는 기타)일 경우: Hub 로그인 진행
        // 토큰을 localStorage에 저장 (쿠키는 포트 간 공유 안 됨)
        setTokens(accessToken, refreshToken);

        toast.success("환영합니다. G Skool입니다. 😄");
        await user.refetch();

        // Hub 메인으로 이동
        navigate({ to: "/" });
      } else {
        toast.error(loginData.error || "로그인에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("Google 로그인 에러:", err);

      // 사용자 친화적 에러 메시지
      let errorMessage = "구글 로그인 중 오류가 발생했습니다.";

      if (err.code === "auth/popup-closed-by-user") {
        // 사용자가 팝업을 닫은 경우 - 에러 토스트 표시하지 않음
        return;
      } else if (err.code === "auth/popup-blocked") {
        errorMessage = "팝업이 차단되었습니다. 팝업 차단을 해제해주세요.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "네트워크 연결을 확인해주세요.";
      } else if (err.code === "auth/cancelled-popup-request") {
        // 이전 팝업 요청 취소 - 에러 토스트 표시하지 않음
        return;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Button
      type="button"
      className="h-auto w-full space-x-2 py-2.5 hover:opacity-90"
      variant={"outline"}
      onClick={handleGoogleLoginClick}
      loading={isPending}
    >
      <img src={googleIcon} className="size-4" />
      <span>{buttonText}</span>
    </Button>
  );
};
