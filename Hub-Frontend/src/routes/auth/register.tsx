import { RegisterWithEmailForm } from "@/components/register-with-email-form";
import { RegisterWithSocialForm } from "@/components/register-with-social-form";
import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const socialType = useSocialSignUp((state) => state.socialType);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100/50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mb-2">
              회원가입
            </h2>
            <p className="text-slate-500 text-sm">
              거북스쿨의 모든 서비스를 이용해보세요
            </p>
          </div>

          {socialType === null ? (
            <RegisterWithEmailForm className="" />
          ) : (
            <RegisterWithSocialForm className="" />
          )}
        </div>

        <div className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Turtle School. All rights reserved.
        </div>
      </div>
    </div>
  );
}
