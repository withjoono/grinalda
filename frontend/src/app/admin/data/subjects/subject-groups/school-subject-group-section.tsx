'use client';

import { columns } from './data-table/columns';
import { SchoolSubjectGroupsDataTable } from './data-table/school-subject-groups-table';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { CreateSubjectGroupDialog } from './create-subject-group-dialog';
import { SchoolSubjectGroup } from '@/apis/hooks/use-subjects';

interface SchoolSubjectGroupSectionProps {
  schoolSubjectGroups: SchoolSubjectGroup[];
}

export function SchoolSubjectGroupSection({
  schoolSubjectGroups,
}: SchoolSubjectGroupSectionProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end space-y-2'>
        <CreateSubjectGroupDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircleIcon className='h-5 w-5' />
            교과 추가
          </Button>
        </CreateSubjectGroupDialog>
      </div>

      <SchoolSubjectGroupsDataTable
        data={schoolSubjectGroups}
        columns={columns}
      />
    </div>
  );
}
