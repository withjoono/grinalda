import { Button } from '@/components/ui/button';
import { TeacherList } from './teacher-list';
import Link from 'next/link';
import { PageRoutes } from '@/constants/routes';

export default function AppEvaluationPage() {
  return (
    <div className='px-4 py-20'>
      <div className='container mx-auto'>
        <div className=''>
          <div className='container flex flex-col items-center text-center'>
            <h2 className='my-4 text-pretty text-2xl font-bold lg:text-4xl'>
              줌(ZOOM) 1:1 컨설팅 안내 / 예약신청
            </h2>
            <div className='mb-8 flex flex-col items-center'>
              <p className='max-w-lg text-muted-foreground lg:text-xl'>
                온라인 합격예측만으로 불안하다면 그리날다 미대입시 전문
                컨설턴트와 1:1 맞춤 합격예측 컨설팅!
              </p>
              <p className='pt-2 text-primary'>
                1:1 컨설팅 이용자는 온라인 수시 예측 서비스를 무료로 이용하실 수
                있습니다.
              </p>
              <p className='pt-2 text-red-500'>준비서류: 생기부, 실기이미지</p>
            </div>
            <div className='flex w-full flex-col justify-center gap-2 sm:flex-row'>
              <Link href={PageRoutes.COMMUNITY_FAQ}>
                <Button variant='outline' className='w-full sm:w-auto'>
                  자주 묻는 질문
                </Button>
              </Link>
            </div>
          </div>
          <TeacherList />
        </div>
      </div>
    </div>
  );
}
