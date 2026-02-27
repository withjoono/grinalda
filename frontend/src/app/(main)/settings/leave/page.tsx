import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DeleteAccountDialog } from '../_components/delete-account-dialog';

export default async function SettingsLeavePage() {
  return (
    <div className='space-y-6 lg:max-w-3xl'>
      <div>
        <h3 className='text-lg font-medium'>회원탈퇴</h3>
        <p className='text-sm text-muted-foreground'>
          회원탈퇴를 신청하기 전에 안내사항을 꼭 확인해주세요!
        </p>
      </div>
      <Separator />

      <div className='space-y-8'>
        <div className='space-y-4'>
          <h3 className='text-2xl font-medium'>
            <b className='text-primary'>그리날다</b>를 이용해주셔서 감사합니다.
          </h3>
          <div className='rounded-lg border p-4'>
            <h4 className='mb-2 font-medium'>⚠️ 안내사항</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                • 회원탈퇴 시 사용하고 계신 아이디는 재사용 및 복구가 불가능
                합니다.
              </li>
              <li>
                • 회원정보 및 입시컨설팅, 모의지원, 질문/답변내역 등 개인형
                서비스 이용 기록은 완전히 삭제됩니다.
              </li>
              <li className='text-red-600'>
                • 삭제된 데이터는 복구가 불가능하니 필요한 데이터는 미리 백업을
                해주세요.
              </li>
            </ul>
          </div>
        </div>

        <div className='flex justify-end'>
          <DeleteAccountDialog>
            <Button variant='destructive'>회원탈퇴</Button>
          </DeleteAccountDialog>
        </div>
      </div>
    </div>
  );
}
