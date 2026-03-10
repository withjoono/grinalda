import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { useAdmissionsByUniversity, useCreateAdmission } from '@/hooks/use-admission-queries';
import { Button } from '@/components/custom/button';
import { DataTable } from '@/components/ui/data-table';
import { IUniversityData } from '@/api/types/university-types';
import { useUniversities } from '@/hooks/use-university-queries';
import { ICreateAdmissionDto } from '@/api/types/admission';
import { AdmissionDialog } from './admission-dialog';
import { columns } from './columns';

const AdmissionManagement = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<IUniversityData | null>(null);
  const {
    data: universities,
    isLoading: isUniversitiesLoading,
    error: universitiesError,
  } = useUniversities(1, 300);
  const {
    data: admissions,
    isLoading: isAdmissionsLoading,
    error: admissionsError,
  } = useAdmissionsByUniversity(selectedUniversity?.id || 0);

  const createAdmissionMutation = useCreateAdmission();

  const handleCreateAdmission = async (dto: ICreateAdmissionDto) => {
    if (!selectedUniversity) {
      toast.error('대학을 먼저 선택해주세요.');
      return;
    }
    const result = await createAdmissionMutation.mutateAsync({ ...dto });
    if (result.success) {
      toast.success('전형이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  if (isUniversitiesLoading) return <div>Loading universities...</div>;
  if (universitiesError) return <div>Error occurred while loading universities</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="대학 선택" description="대학을 먼저 선택해주세요." />
      </div>
      <Separator />
      <div className="mb-4 flex flex-wrap gap-2">
        {universities?.universities.map((university) => (
          <Button
            key={university.id}
            variant={selectedUniversity?.id === university.id ? 'default' : 'outline'}
            onClick={() => setSelectedUniversity(university)}
            className="px-4"
          >
            {university.name} ({university.region})
          </Button>
        ))}
      </div>
      {selectedUniversity && (
        <>
          <Heading
            title={`${selectedUniversity.name} 전형 관리 (${admissions?.length || 0})`}
            description="전형을 관리합니다."
          />
          <div className="flex justify-end">
            <AdmissionDialog
              universityId={selectedUniversity.id}
              trigger={<Button>새 전형 추가</Button>}
              onCreate={handleCreateAdmission}
            />
          </div>
          {isAdmissionsLoading ? (
            <div>Loading admissions...</div>
          ) : admissionsError ? (
            <div>Error occurred while loading admissions</div>
          ) : (
            <DataTable columns={columns} data={admissions || []} />
          )}
        </>
      )}
    </div>
  );
};

export default AdmissionManagement;
