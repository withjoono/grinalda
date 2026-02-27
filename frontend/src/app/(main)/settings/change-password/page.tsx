import { Separator } from '@/components/ui/separator';
import { ChangePasswordForm } from '../_components/change-password-form';

export default async function SettingsChangePasswordPage() {
  return (
    <div className='space-y-6 lg:max-w-3xl'>
      <div>
        <h3 className='text-lg font-medium'>비밀번호 변경</h3>
        <p className='text-sm text-muted-foreground'>
          새로운 비밀번호를 설정합니다.
        </p>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
  );
}
