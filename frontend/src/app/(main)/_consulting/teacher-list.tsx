'use client';

import { useAllTeachers } from '@/apis/hooks/use-evaluation';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { EvaluationDialog } from './evaluation-dialog';

export const TeacherList = () => {
  const { data: teachers, isPending, isError, refetch } = useAllTeachers();

  if (isPending) return <LoadingSection />;
  if (isError)
    return (
      <ErrorSection
        onRetry={refetch}
        text='평가자 목록을 불러오는 중 오류가 발생했습니다.'
      />
    );

  return (
    <div className='container mt-8 grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-5'>
      {teachers.map((teacher) => (
        <div key={teacher.id} className='flex flex-col items-center'>
          <ProfileAvatar
            profileImage={teacher.profileImage}
            name={teacher.name}
            className='mb-2'
          />
          <p className='w-full text-left font-medium'>{teacher.name}</p>
          <p className='w-full text-left text-muted-foreground'>
            홍익대 디자인학부
          </p>
          <p className='mb-2 w-full py-2 text-sm text-muted-foreground'>
            Elig doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>
          <EvaluationDialog teacher={teacher}>
            <Button className='w-full'>예약 결제하기</Button>
          </EvaluationDialog>
          <p className='pt-2 text-xs text-red-500'>
            네이버 예약결제 창으로 이동합니다.
          </p>
        </div>
      ))}
    </div>
  );
};
