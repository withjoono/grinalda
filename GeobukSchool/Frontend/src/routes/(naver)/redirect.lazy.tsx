import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { useLoginWithSocial } from "@/stores/server/features/auth/mutations";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/(naver)/redirect")({
  component: Redirect,
});

function Redirect() {
  const setData = useSocialSignUp((state) => state.setData);
  const loginWithSocial = useLoginWithSocial();
  const navigate = useNavigate();
  const user = useGetCurrentUser();
  const init = () => {
    try {
      // 네이버 SDK가 로드되지 않은 경우 처리
      if (!window.naver || !window.naver.LoginWithNaverId) {
        console.error("네이버 로그인 SDK가 로드되지 않았습니다.");
        toast.error("네이버 로그인을 사용할 수 없습니다.");
        navigate({ to: "/auth/login" });
        return;
      }

      const { naver } = window;
      const naverLogin = new naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_LOGIN_CLIENT_ID,
        callbackHandle: false,
        isPopup: false,
      });
      naverLogin.init();
      naverLogin.getLoginStatus(async () => {
        try {
          // 액세스 토큰 확인
          if (!naverLogin.accessToken?.accessToken) {
            toast.error("네이버 로그인 실패: 액세스 토큰을 가져올 수 없습니다.");
            navigate({ to: "/auth/login" });
            return;
          }

          const result = await loginWithSocial.mutateAsync({
            socialType: "naver",
            accessToken: naverLogin.accessToken.accessToken,
          });

          if (result.success) {
            toast.success("환영합니다. 거북스쿨입니다. 😄");
            await user.refetch();
            navigate({ to: "/" });
          } else {
            // 실패 시 회원가입을 위해 oauth정보 저장
            setData({
              socialType: "naver",
              token: naverLogin.accessToken.accessToken,
            });
            navigate({ to: "/auth/register", replace: true });
            toast.error(result.error);
          }
        } catch (error) {
          console.error("네이버 로그인 처리 중 오류:", error);
          toast.error("로그인 처리 중 오류가 발생했습니다.");
          navigate({ to: "/auth/login" });
        }
      });
    } catch (error) {
      console.error("네이버 로그인 초기화 실패:", error);
      toast.error("네이버 로그인을 초기화할 수 없습니다.");
      navigate({ to: "/auth/login" });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return <div></div>;
}
