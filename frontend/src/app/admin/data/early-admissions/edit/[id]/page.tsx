'use client';

import { useEarlyAdmissionDetail } from '@/apis/hooks/use-early-admissions';
import EarlyAdmissionForm from '../../early-admission-form';
import { useAllAdmissionTypes } from '@/apis/hooks/use-admission-types';
import { useAllSearchTags } from '@/apis/hooks/use-search-tags';
import { useAllUniversities } from '@/apis/hooks/use-universities';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useParams } from 'next/navigation';

export default function EditEarlyAdmissionPage() {
  const params = useParams<{ id: string }>();
  const {
    data: universities,
    isPending: isUniversitiesPending,
    isError: isUniversitiesError,
    refetch: refetchUniversities,
  } = useAllUniversities();
  const {
    data: searchTags,
    isPending: isSearchTagsPending,
    isError: isSearchTagsError,
    refetch: refetchSearchTags,
  } = useAllSearchTags();
  const {
    data: admissionTypes,
    isPending: isAdmissionTypesPending,
    isError: isAdmissionTypesError,
    refetch: refetchAdmissionTypes,
  } = useAllAdmissionTypes();
  const {
    data: earlyAdmission,
    isPending: isEarlyAdmissionPending,
    isError: isEarlyAdmissionError,
    refetch: refetchEarlyAdmission,
  } = useEarlyAdmissionDetail(Number(params.id));

  if (isUniversitiesPending) return <LoadingSection />;
  if (isUniversitiesError)
    return <ErrorSection onRetry={refetchUniversities} />;

  if (isSearchTagsPending) return <LoadingSection />;
  if (isSearchTagsError) return <ErrorSection onRetry={refetchSearchTags} />;

  if (isAdmissionTypesPending) return <LoadingSection />;
  if (isAdmissionTypesError)
    return <ErrorSection onRetry={refetchAdmissionTypes} />;

  if (isEarlyAdmissionPending) return <LoadingSection />;
  if (isEarlyAdmissionError)
    return <ErrorSection onRetry={refetchEarlyAdmission} />;

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <EarlyAdmissionForm
          universities={universities}
          searchTags={searchTags}
          admissionTypes={admissionTypes}
          initialData={earlyAdmission}
        />
      </div>
    </div>
  );
}
