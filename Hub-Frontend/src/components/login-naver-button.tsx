import { useEffect, useState } from "react";
import { Button } from "./custom/button";
import naverIcon from "@/assets/icon/login-naver.png";
import { env } from "@/lib/config/env";
import { toast } from "sonner";

interface Props {
  isPending?: boolean;
  buttonText?: string;
}

export const NaverLoginButton = ({ isPending, buttonText = "네이버 로그인" }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const init = () => {
    // 환경 변수 검증
    if (!env.naverLoginClientId) {
      console.error("❌ 네이버 로그인 Client ID가 설정되지 않았습니다.");
      return;
    }

    try {
      const { naver } = window;
      if (!naver?.LoginWithNaverId) {
        console.error("❌ 네이버 로그인 SDK가 로드되지 않았습니다.");
        return;
      }

      const naverLogin = new naver.LoginWithNaverId({
        clientId: env.naverLoginClientId,
        callbackUrl: `${env.frontUrl}/redirect`,
        callbackHandle: true,
        isPopup: false,
        loginButton: {
          type: 3,
        },
      });
      naverLogin.init();
      setIsInitialized(true);
    } catch (error) {
      console.error("❌ 네이버 로그인 초기화 실패:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleClickNaverLogin = async () => {
    if (!isInitialized) {
      toast.error("네이버 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const loginButton = document.getElementById("naverIdLogin_loginButton");
    if (!loginButton) {
      toast.error("네이버 로그인 버튼을 찾을 수 없습니다.");
      return;
    }

    loginButton.click();
  };

  return (
    <>
      <Button
        type="button"
        className="h-auto w-full space-x-2 bg-[#06be34] py-2.5 text-white hover:bg-[#06be34] hover:opacity-90"
        onClick={handleClickNaverLogin}
        loading={isPending}
      >
        <img src={naverIcon} className="size-4" />
        <span>{buttonText}</span>
      </Button>
      <div id="naverIdLogin" className="hidden" />
    </>
  );
};
