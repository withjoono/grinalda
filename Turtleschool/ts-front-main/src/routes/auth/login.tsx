import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/client/use-auth-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      navigate({ to: "/" });
    }
  }, [accessToken]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-full sm:max-w-[400px]">
            <div className="space-y-2 pb-6">
              <h2 className="text-xl font-medium sm:text-3xl">로그인</h2>
              <p className="text-sm text-foreground/60">
                👋 안녕하세요. AI가 아닌 실제 전직 입학사정관이 꼼꼼한 평가를
                진행하는 입시 예측 플랫폼 거북스쿨입니다.
              </p>
            </div>
            <LoginForm className="" />
          </div>
        </div>
      </div>
    </div>
  );
}
