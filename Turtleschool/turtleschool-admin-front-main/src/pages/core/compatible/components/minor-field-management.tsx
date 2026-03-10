import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useMajorFields,
  useMidFields,
  useMinorFields,
  useCreateMinorField,
  useDeleteMinorField,
  useUpdateMinorField,
} from '@/hooks/use-fields-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IMajorFieldData, IMidFieldData } from '@/api/types/fields-types';
import { MinorFieldDialog } from './minor-field-dialog';

const MinorFieldManagement = () => {
  const [selectedMajorField, setSelectedMajorField] = useState<IMajorFieldData | null>(null);
  const [selectedMidField, setSelectedMidField] = useState<IMidFieldData | null>(null);
  const {
    data: majorFields,
    isLoading: isMajorFieldsLoading,
    error: majorFieldsError,
  } = useMajorFields();
  const { data: midFields, isLoading: isMidFieldsLoading, error: midFieldsError } = useMidFields();
  const {
    data: minorFields,
    isLoading: isMinorFieldsLoading,
    error: minorFieldsError,
  } = useMinorFields();
  const createMinorFieldMutation = useCreateMinorField();
  const updateMinorFieldMutation = useUpdateMinorField();
  const deleteMinorFieldMutation = useDeleteMinorField();

  const handleAddMinorField = async (newField: { name: string; midFieldId: number }) => {
    if (!selectedMidField) {
      toast.error('중계열을 먼저 선택해주세요.');
      return;
    }
    const result = await createMinorFieldMutation.mutateAsync({
      ...newField,
      midFieldId: selectedMidField.id,
    });
    if (result.success) {
      toast.success('소계열이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateMinorField = async (
    id: number,
    updatedField: { name?: string; midFieldId?: number }
  ) => {
    const result = await updateMinorFieldMutation.mutateAsync({ id, data: updatedField });
    if (result.success) {
      toast.success('소계열이 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMinorField = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteMinorFieldMutation.mutateAsync(id);
      if (result.success) {
        toast.success('소계열이 성공적으로 삭제되었습니다.');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (isMajorFieldsLoading || isMidFieldsLoading || isMinorFieldsLoading)
    return <div>Loading...</div>;
  if (majorFieldsError || midFieldsError || minorFieldsError) return <div>Error occurred</div>;

  if (!majorFields || majorFields.length === 0) {
    return <div>대계열이 필요합니다. 먼저 대계열을 생성해주세요.</div>;
  }

  const filteredMidFields = midFields?.filter(
    (midField) => midField.major_field_id === selectedMajorField?.id
  );

  const filteredMinorFields = minorFields?.filter(
    (minorField) => minorField.mid_field_id === selectedMidField?.id
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
            onClick={() => {
              setSelectedMajorField(majorField);
              setSelectedMidField(null);
            }}
            className="px-12"
          >
            {majorField.id} - {majorField.name} ({majorField.mid_fields?.length || 0})
          </Button>
        ))}
      </div>
      {selectedMajorField && (
        <Heading title={`중계열 선택`} description="중계열을 먼저 선택해주세요." />
      )}
      {selectedMajorField && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filteredMidFields?.map((midField) => (
            <Button
              key={midField.id}
              variant={selectedMidField?.id === midField.id ? 'default' : 'outline'}
              onClick={() => setSelectedMidField(midField)}
              className="px-12"
            >
              {midField.id} - {midField.name} ({midField.minor_fields?.length || 0})
            </Button>
          ))}
        </div>
      )}
      {selectedMidField && (
        <Heading
          title={`소계열 관리 (${filteredMinorFields?.length || 0})`}
          description="소계열을 관리합니다."
        />
      )}
      {selectedMidField && (
        <>
          <div className="flex justify-end">
            <MinorFieldDialog
              onSave={handleAddMinorField}
              trigger={<Button>새 소계열 추가</Button>}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {filteredMinorFields?.map((item) => (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-12">
                    <span className="sr-only">Open menu</span>
                    {item.id} - {item.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div onClick={(e) => e.stopPropagation()}>
                    <MinorFieldDialog
                      minorField={item}
                      onSave={(updatedField) => handleUpdateMinorField(item.id, updatedField)}
                      trigger={
                        <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                          수정
                        </button>
                      }
                    />
                  </div>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMinorField(item.id)}
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

export default MinorFieldManagement;
