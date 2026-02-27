import { LifeRecordInputTabs } from './life-record-input-tabs';

export default function AppScoreManagementPage() {
  return (
    <div className='mt-5'>
      <div className='mx-auto w-full max-w-screen-lg py-4'>
        <div className='pb-4'>
          <h3 className='text-lg font-medium'>성적 입력</h3>
          <p className='text-sm text-muted-foreground'>
            아래의 형식에 맞춰 생기부를 입력해주세요!
          </p>
          <p className='text-sm text-muted-foreground'>
            필드 형식이 다르거나 범위에서 벗어난 경우 계산식에서 제외되니 다시
            한번 확인해주세요.
          </p>
        </div>
        <LifeRecordInputTabs />
      </div>
    </div>
  );
}
