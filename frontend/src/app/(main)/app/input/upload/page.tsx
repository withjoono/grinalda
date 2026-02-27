import { LifeRecordInputTabs } from '../../score-management/life-record-input-tabs';

export default function UploadPage() {
    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>생기부 입력</h3>
                    <p className='text-sm text-muted-foreground'>
                        PDF 생기부를 업로드하거나 직접 성적을 입력하세요.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        업로드 후 누락된 과목 및 성적을 확인하고 저장해주세요.
                    </p>
                </div>
                <LifeRecordInputTabs />
            </div>
        </div>
    );
}
