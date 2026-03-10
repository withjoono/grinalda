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

interface Props {
  isPending?: boolean;
}

export const GoogleLoginButton = ({ isPending }: Props) => {
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
          navigate({ to: "/" });
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
        console.log(err);
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
      <span>구글로 계속하기</span>
    </Button>
  );
};
