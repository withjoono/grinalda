'use client';

import { columns } from './data-table/columns';
import { AdmissionTypesDataTable } from './data-table/admission-types-table';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateAdmissionTypeDialog } from './create-admission-type-dialog';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useAllAdmissionTypes } from '@/apis/hooks/use-admission-types';

export default function AdminDataAdmissionTypesPage() {
  const {
    data: admissionTypes,
    isPending,
    isError,
    refetch,
  } = useAllAdmissionTypes();

  if (isPending) return <LoadingSection />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>전형 유형 목록</h1>
        <CreateAdmissionTypeDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            전형 유형 추가
          </Button>
        </CreateAdmissionTypeDialog>
      </div>
      <AdmissionTypesDataTable data={admissionTypes} columns={columns} />
    </div>
  );
}
