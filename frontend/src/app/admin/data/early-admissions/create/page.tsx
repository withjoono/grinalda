'use client';

import { useAllUniversities } from '@/apis/hooks/use-universities';
import EarlyAdmissionForm from '../early-admission-form';
import { useAllSearchTags } from '@/apis/hooks/use-search-tags';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllAdmissionTypes } from '@/apis/hooks/use-admission-types';

export default function CreateEarlyAdmissionPage() {
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

  if (isUniversitiesPending) return <LoadingSection />;
  if (isUniversitiesError)
    return <ErrorSection onRetry={refetchUniversities} />;

  if (isSearchTagsPending) return <LoadingSection />;
  if (isSearchTagsError) return <ErrorSection onRetry={refetchSearchTags} />;

  if (isAdmissionTypesPending) return <LoadingSection />;
  if (isAdmissionTypesError)
    return <ErrorSection onRetry={refetchAdmissionTypes} />;

  return (
    <div className='container mx-auto max-w-screen-lg'>
      <div className='space-y-4'>
        <EarlyAdmissionForm
          universities={universities}
          searchTags={searchTags}
          admissionTypes={admissionTypes}
        />
      </div>
    </div>
  );
}
