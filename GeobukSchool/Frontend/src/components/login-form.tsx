import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./custom/button";
import { loginFormSchema } from "@/lib/validations/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLoginWithEmail } from "@/stores/server/features/auth/mutations";
// import { NaverLoginButton } from "./login-naver-button";
import { GoogleLoginButton } from "./login-google-button";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
interface Props {
  className?: string;
}

export function LoginForm({ className }: Props) {
  const navigate = useNavigate();
  const loginWithEmail = useLoginWithEmail();
  const user = useGetCurrentUser();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (loginWithEmail.isPending) return;
    const result = await loginWithEmail.mutateAsync({
      email: values.email,
      password: values.password,
    });
    // // 스프링 시큐리티에 로그인 등록
    // await emailLoginFetch({
    //   email: values.email,
    //   password: values.password,
    // });

    if (result.success) {
      toast.success("환영합니다. 😄");
      await user.refetch();
      navigate({ to: "/" });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <div className={cn("space-y-2", className)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일 주소" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>패스워드</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="off"
                      placeholder="패스워드"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginWithEmail.isPending}
          >
            로그인
          </Button>
        </form>
        <div className="flex justify-center pt-2">
          <Link
            to="/auth/register"
            className="text-sm text-blue-500 hover:underline"
          >
            이메일로 회원가입하기
          </Link>
        </div>
        <div className="flex justify-center">
          <Link
            to="/auth/reset-password"
            className="text-sm text-blue-500 hover:underline"
          >
            패스워드 재설정
          </Link>
        </div>

        <div className="py-2">
          <Separator />
        </div>
        <div className="space-y-2">
          <GoogleLoginButton isPending={loginWithEmail.isPending} />
          {/* <NaverLoginButton isPending={loginWithEmail.isPending} /> */}
        </div>
      </div>
    </Form>
  );
}
