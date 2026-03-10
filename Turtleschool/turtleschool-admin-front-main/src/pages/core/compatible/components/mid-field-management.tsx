import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useMajorFields,
  useMidFields,
  useCreateMidField,
  useDeleteMidField,
  useUpdateMidField,
} from '@/hooks/use-fields-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IMajorFieldData } from '@/api/types/fields-types';
import { MidFieldDialog } from './mid-field-dialog';

const MidFieldManagement = () => {
  const [selectedMajorField, setSelectedMajorField] = useState<IMajorFieldData | null>(null);
  const {
    data: majorFields,
    isLoading: isMajorFieldsLoading,
    error: majorFieldsError,
  } = useMajorFields();
  const { data: midFields, isLoading: isMidFieldsLoading, error: midFieldsError } = useMidFields();
  const createMidFieldMutation = useCreateMidField();
  const updateMidFieldMutation = useUpdateMidField();
  const deleteMidFieldMutation = useDeleteMidField();

  const handleAddMidField = async (newField: { name: string; majorFieldId: number }) => {
    if (!selectedMajorField) {
      toast.error('대계열을 먼저 선택해주세요.');
      return;
    }
    const result = await createMidFieldMutation.mutateAsync({
      ...newField,
      majorFieldId: selectedMajorField.id,
    });
    if (result.success) {
      toast.success('중계열이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateMidField = async (
    id: number,
    updatedField: { name?: string; majorFieldId?: number }
  ) => {
    const result = await updateMidFieldMutation.mutateAsync({ id, data: updatedField });
    if (result.success) {
      toast.success('중계열이 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMidField = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteMidFieldMutation.mutateAsync(id);
      if (result.success) {
        toast.success('중계열이 성공적으로 삭제되었습니다.');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (isMajorFieldsLoading || isMidFieldsLoading) return <div>Loading...</div>;
  if (majorFieldsError || midFieldsError) return <div>Error occurred</div>;

  if (!majorFields || majorFields.length === 0) {
    return <div>대계열이 필요합니다. 먼저 대계열을 생성해주세요.</div>;
  }

  const filteredMidFields = midFields?.filter(
    (midField) => midField.major_field_id === selectedMajorField?.id
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title={`대계열 선택`} description="대계열을 먼저 선택해주세요." />
      </div>
      <Separator />
      <div className="mb-4 flex flex-wrap gap-2">
        {majorFields.map((majorField) => (
          <Button
            key={majorField.id}
            variant={selectedMajorField?.id === majorField.id ? 'default' : 'outline'}
            onClick={() => setSelectedMajorField(majorField)}
            className="px-12"
          >
            {majorField.id} - {majorField.name} ({majorField.mid_fields?.length || 0})
          </Button>
        ))}
      </div>
      {selectedMajorField && (
        <Heading
          title={`중계열 관리 (${filteredMidFields?.length || 0})`}
          description="중계열을 관리합니다. (중계열 삭제 시 하위 소계열이 전부 삭제됩니다)"
        />
      )}
      {selectedMajorField && (
        <>
          <div className="flex justify-end">
            <MidFieldDialog onSave={handleAddMidField} trigger={<Button>새 중계열 추가</Button>} />
          </div>
          <div className="flex flex-wrap gap-4">
            {filteredMidFields?.map((item) => (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-12">
                    <span className="sr-only">Open menu</span>
                    {item.id} - {item.name} ({item.minor_fields?.length || 0})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div onClick={(e) => e.stopPropagation()}>
                    <MidFieldDialog
                      midField={item}
                      onSave={(updatedField) => handleUpdateMidField(item.id, updatedField)}
                      trigger={
                        <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                          수정
                        </button>
                      }
                    />
                  </div>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMidField(item.id)}
                    className="cursor-pointer text-red-500"
                  >
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MidFieldManagement;
