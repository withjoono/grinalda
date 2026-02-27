import { LifeRecordInputTabs } from '../../score-management/life-record-input-tabs';

export default function UploadPage() {
    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>생기부 입력</h3>
                    <p className='text-sm text-muted-foreground'>
                        PDF 생기부를 업로드하면, 아래에 성적이 자동으로 입력됩니다.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        불러온 성적을 확인하고, 필요시 수정한 뒤 저장해주세요.
                    </p>
                </div>
                <LifeRecordInputTabs />
            </div>
        </div>
    );
}
