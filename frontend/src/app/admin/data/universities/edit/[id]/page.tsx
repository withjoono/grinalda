'use client';
import UniversityForm from '../../university-form';
import { useAllUniversities } from '@/apis/hooks/use-universities';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import { useAllRegions } from '@/apis/hooks/use-regions';
import { useParams } from 'next/navigation';

export default function EditUniversityPage() {
  const params = useParams<{ id: string }>();

  const {
    data: regions,
    isPending: regionsPending,
    isError: regionsError,
    refetch: regionsRefetch,
  } = useAllRegions();

  const {
    data: universities,
    isPending: universitiesPending,
    isError: universitiesError,
    refetch: universitiesRefetch,
  } = useAllUniversities();

  if (regionsPending) return <LoadingSection />;
  if (regionsError)
    return (
      <ErrorSection
        onRetry={regionsRefetch}
        text='지역 데이터를 불러오는 중 오류가 발생했습니다.'
      />
    );

  if (universitiesPending) return <LoadingSection />;
  if (universitiesError)
    return (
      <ErrorSection
        onRetry={universitiesRefetch}
        text='대학 데이터를 불러오는 중 오류가 발생했습니다.'
      />
    );

  const university = universities?.find(
    (university) => university.id === Number(params.id)
  );

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <UniversityForm regions={regions} initialData={university} />
      </div>
    </div>
  );
}
