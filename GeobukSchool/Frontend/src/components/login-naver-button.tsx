import { useEffect } from "react";
import { Button } from "./custom/button";
import naverIcon from "@/assets/icon/login-naver.png";

interface Props {
  isPending?: boolean;
}

export const NaverLoginButton = ({ isPending }: Props) => {
  const init = () => {
    try {
      // 네이버 SDK가 로드되지 않은 경우 처리
      if (!window.naver || !window.naver.LoginWithNaverId) {
        console.warn("네이버 로그인 SDK가 로드되지 않았습니다.");
        return;
      }

      const { naver } = window;
      const naverLogin = new naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_LOGIN_CLIENT_ID,
        callbackUrl: `${import.meta.env.VITE_FRONT_URL}/redirect`,
        callbackHandle: true,
        isPopup: false,
        loginButton: {
          type: 3,
        },
      });
      naverLogin.init();
    } catch (error) {
      console.error("네이버 로그인 초기화 실패:", error);
    }
  };

  useEffect(() => {
    // DOM이 완전히 로드된 후 초기화
    const timer = setTimeout(init, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClickNaverLogin = async () => {
    document.getElementById("naverIdLogin_loginButton")?.click();
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
        <span>네이버로 계속하기</span>
      </Button>
      <div id="naverIdLogin" className="hidden" />
    </>
  );
};
