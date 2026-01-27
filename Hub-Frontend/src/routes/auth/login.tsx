import { GoogleLoginButton } from "@/components/login-google-button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-full sm:max-w-[400px]">
            <div className="flex flex-col items-center space-y-2 pb-8">
              <h3 className="text-xl font-medium sm:text-2xl">로그인</h3>
              <p className="text-sm text-muted-foreground">
                Google 계정으로 간편하게 로그인하세요
              </p>
            </div>
            <div className="space-y-4">
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
