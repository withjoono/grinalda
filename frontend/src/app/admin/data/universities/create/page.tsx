'use client';

import UniversityForm from '../university-form';
import { useAllRegions } from '@/apis/hooks/use-regions';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';

export default function CreateUniversityPage() {
  const { data: regions, isPending, isError, refetch } = useAllRegions();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <UniversityForm regions={regions} />
      </div>
    </div>
  );
}
