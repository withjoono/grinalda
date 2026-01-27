import { RegisterWithEmailForm } from "@/components/register-with-email-form";
import { RegisterWithSocialForm } from "@/components/register-with-social-form";
import { useSocialSignUp } from "@/stores/client/use-social-sign-up";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const socialType = useSocialSignUp((state) => state.socialType);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-full sm:max-w-[400px]">
            <div className="pb-6">
              <h2 className="text-xl font-medium sm:text-3xl">회원가입</h2>
            </div>
            {socialType === null ? (
              <RegisterWithEmailForm className="" />
            ) : (
              <RegisterWithSocialForm className="" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
