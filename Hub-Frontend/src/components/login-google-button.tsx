import { Button } from "./custom/button";
import googleIcon from "@/assets/icon/login-google.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { useLoginWithSocial } from "@/stores/server/features/auth/mutations";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { socialLoginFetch } from "@/stores/server/features/auth/apis";
import { auth, provider } from "@/lib/utils/firebase/firebase";
import { USER_API } from "@/stores/server/features/me/apis";

interface Props {
  isPending?: boolean;
  buttonText?: string;
}

export const GoogleLoginButton = ({ isPending, buttonText = "구글 로그인" }: Props) => {
  const setData = useSocialSignUp((state) => state.setData);
  const loginWithSocial = useLoginWithSocial();
  const navigate = useNavigate();
  const user = useGetCurrentUser();

  const handleGoogleLoginClick = () => {
    signInWithPopup(auth, provider)
      .then(async (data) => {
        const credential = GoogleAuthProvider.credentialFromResult(data);

        if (!credential?.idToken) {
          toast.error(
            "소셜 간편 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
          );
          return;
        }
        const result = await loginWithSocial.mutateAsync({
          socialType: "google",
          accessToken: credential.idToken,
        });
        // 스프링 시큐리티에 로그인
        socialLoginFetch({ oauthId: data?.user?.providerData[0].uid });
        if (result.success) {
          toast.success("환영합니다. 거북스쿨입니다. 😄");
          await user.refetch();

          // 사용자 정보를 가져와서 memberType에 따라 리다이렉트
          try {
            const userData = await USER_API.fetchCurrentUserAPI();
            if (userData?.memberType === 'teacher') {
              navigate({ to: "/mentoring/admin" });
            } else if (userData?.memberType === 'parent') {
              navigate({ to: "/mentoring/parent" });
            } else {
              navigate({ to: "/" });
            }
          } catch {
            navigate({ to: "/" });
          }
        } else {
          if (result.error !== "이미 사용중인 이메일입니다.") {
            // 실패 시 회원가입을 위해 oauth정보 저장
            setData({
              socialType: "google",
              token: credential.idToken,
            });
            navigate({ to: "/auth/register", replace: true });
          }
          toast.error(result.error);
        }
      })
      .catch((err) => {
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
      });
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
