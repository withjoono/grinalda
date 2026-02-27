import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { EarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const ReportSection = ({
  isSubscribed,
}: {
  schoolRecord: UserSchoolRecord;
  earlyAdmission: EarlyAdmissionDetail;
  preApplyScores: { scores: number[] };
  isSubscribed: boolean;
}) => {
  return (
    <div className='mt-12 space-y-4'>
      <section>
        {!isSubscribed ? (
          <div className='mx-auto max-w-xl rounded-lg py-32 text-center'>
            <div className='mb-4 text-4xl'>🧐</div>
            <h3 className='mb-3 text-xl font-semibold'>
              이용권 구매가 필요합니다
            </h3>
            <p className='mb-6 text-gray-600'>
              상세한 리포트를 확인하시려면 이용권을 구매해주세요.
            </p>
            <Link
              href={PageRoutes.PURCHASE}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              이용권 구매
            </Link>
          </div>
        ) : (
          <div className='rounded-lg bg-white py-8'>
            <h3 className='mb-2 text-lg font-semibold'>유료 리포트</h3>
            <p className='text-gray-600'>
              여기에 실제 리포트 내용이 들어갈 예정입니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
