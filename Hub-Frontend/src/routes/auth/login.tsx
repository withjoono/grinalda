import { GoogleLoginButton } from "@/components/login-google-button";
import { LoginWithEmailForm } from "@/components/login-with-email-form";
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
