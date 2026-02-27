'use client';

import { SchoolSubjectsDataTable } from './data-table/school-subjects-table';
import { columns } from './data-table/columns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PlusCircleIcon } from 'lucide-react';
import { CreateSubjectDialog } from './create-subject-dialog';
import { SchoolSubjectGroup } from '@/apis/hooks/use-subjects';

interface SchoolSubjectSectionProps {
  schoolSubjects: SchoolSubjectGroup[];
}

export function SchoolSubjectSection({
  schoolSubjects,
}: SchoolSubjectSectionProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const groups = schoolSubjects.map((group) => {
    return {
      id: group.id,
      name: group.name,
      subjects: group.subjects,
    };
  });
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2'>
        {groups.map((group) => (
          <Button
            key={group.id}
            variant={selectedGroupId === group.id ? 'default' : 'outline'}
            onClick={() => setSelectedGroupId(group.id)}
          >
            {group.name}
          </Button>
        ))}
      </div>
      {selectedGroup && (
        <div className='flex items-center justify-end space-y-2'>
          <CreateSubjectDialog subjectGroupId={selectedGroupId}>
            <Button className='flex items-center gap-2'>
              <PlusCircleIcon className='h-5 w-5' />
              교과 추가
            </Button>
          </CreateSubjectDialog>
        </div>
      )}

      {selectedGroupId ? (
        <SchoolSubjectsDataTable
          data={selectedGroup?.subjects || []}
          columns={columns}
        />
      ) : (
        <p className='py-20 text-center text-sm text-primary'>
          과목을 선택해주세요.
        </p>
      )}
    </div>
  );
}
