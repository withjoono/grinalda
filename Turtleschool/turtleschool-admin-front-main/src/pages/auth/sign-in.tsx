import { Card } from '@/components/ui/card';
import { UserAuthForm } from './components/user-auth-form';
import HeaderLogo from '@/assets/header-logo.svg?react';

export default function SignIn() {
  return (
    <>
      <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center">
            <HeaderLogo className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-medium">거북스쿨 어드민</h1>
          </div>
          <Card className="p-6">
            <div className="flex flex-col space-y-2 pb-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
              <p className="text-sm text-muted-foreground">
                이메일과 비밀번호를 입력하여 로그인하세요
              </p>
            </div>
            <UserAuthForm />
          </Card>
        </div>
      </div>
    </>
  );
}
