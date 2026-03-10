import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { useAdmissionsByUniversity } from '@/hooks/use-admission-queries';
import { Button } from '@/components/custom/button';
import { DataTable } from '@/components/ui/data-table';
import { IUniversityData } from '@/api/types/university-types';
import { IAdmissionData } from '@/api/types/admission';
import { useUniversities } from '@/hooks/use-university-queries';
import { ICreateRecruitmentUnitDto } from '@/api/types/recruitment';
import {
  useCreateRecruitmentUnit,
  useRecruitmentUnitsByAdmission,
} from '@/hooks/use-recruitment-queries';
import { RecruitmentUnitDialog } from './recruitment-dialog';
import { columns } from './columns';
import { cn } from '@/lib/utils';

const RecruitmentManagement = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<IUniversityData | null>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<IAdmissionData | null>(null);
  const {
    data: universities,
    isLoading: isUniversitiesLoading,
    error: universitiesError,
  } = useUniversities(1, 300);
  const { data: admissions } = useAdmissionsByUniversity(selectedUniversity?.id || 0);
  const {
    data: recruitmentUnits,
    isLoading: isRecruitmentUnitsLoading,
    error: recruitmentUnitsError,
  } = useRecruitmentUnitsByAdmission(selectedAdmission?.id || 0);

  const createRecruitmentUnitMutation = useCreateRecruitmentUnit();

  const handleCreateRecruitmentUnit = async (dto: ICreateRecruitmentUnitDto) => {
    if (!selectedAdmission) {
      toast.error('전형을 먼저 선택해주세요.');
      return;
    }
    const result = await createRecruitmentUnitMutation.mutateAsync(dto);
    if (result.success) {
      toast.success('모집단위가 성공적으로 추가되었습니다.');
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
            onClick={() => {
              setSelectedUniversity(university);
              setSelectedAdmission(null);
            }}
            className="px-4"
          >
            {university.name} ({university.region})
          </Button>
        ))}
      </div>
      {selectedUniversity && (
        <>
          <Heading
            title={`${selectedUniversity.name} 전형 선택`}
            description="전형을 선택해주세요."
          />
          <div className="mb-4 flex flex-wrap gap-2">
            {admissions?.map((admission) => (
              <Button
                key={admission.id}
                variant={selectedAdmission?.id === admission.id ? 'default' : 'outline'}
                onClick={() => setSelectedAdmission(admission)}
                className={cn(
                  'px-4',
                  admission.category.name === '학생부종합' && 'text-purple-500',
                  admission.category.name === '학생부교과' && 'text-blue-500'
                )}
              >
                {admission.name}({admission.recruitment_units.length})
              </Button>
            ))}
          </div>
        </>
      )}
      {selectedAdmission && (
        <>
          <Heading
            title={`${selectedAdmission.name} 모집단위 관리 (${recruitmentUnits?.length || 0})`}
            description="모집단위를 관리합니다."
          />
          <div className="flex justify-end">
            <RecruitmentUnitDialog
              admissionId={selectedAdmission.id}
              trigger={<Button>새 모집단위 추가</Button>}
              onCreate={handleCreateRecruitmentUnit}
            />
          </div>
          {isRecruitmentUnitsLoading ? (
            <div>Loading recruitment units...</div>
          ) : recruitmentUnitsError ? (
            <div>Error occurred while loading recruitment units</div>
          ) : (
            <DataTable columns={columns} data={recruitmentUnits || []} />
          )}
        </>
      )}
    </div>
  );
};

export default RecruitmentManagement;
