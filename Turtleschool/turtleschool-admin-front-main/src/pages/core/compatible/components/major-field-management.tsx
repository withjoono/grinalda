import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useMajorFields,
  useCreateMajorField,
  useDeleteMajorField,
  useUpdateMajorField,
} from '@/hooks/use-fields-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { MajorFieldDialog } from './major-field-dialog';

const MajorFieldManagement = () => {
  const { data, isLoading, error } = useMajorFields();
  const createMajorFieldMutation = useCreateMajorField();
  const updateMajorFieldMutation = useUpdateMajorField();
  const deleteMajorFieldMutation = useDeleteMajorField();

  const handleAddMajorField = async (newField: { name: string }) => {
    const result = await createMajorFieldMutation.mutateAsync(newField);
    if (result.success) {
      toast.success('대계열이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateMajorField = async (id: number, updatedField: { name?: string }) => {
    const result = await updateMajorFieldMutation.mutateAsync({ id, data: updatedField });
    if (result.success) {
      toast.success('대계열이 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMajorField = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteMajorFieldMutation.mutateAsync(id);
      if (result.success) {
        toast.success('대계열이 성공적으로 삭제되었습니다.');
      } else {
        toast.error(result.error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading
          title={`대계열 관리 (${data?.length || 0})`}
          description="대계열을 관리합니다. (대계열 삭제 시 하위 중계열이 전부 삭제됩니다)"
        />
        <MajorFieldDialog onSave={handleAddMajorField} trigger={<Button>새 대계열 추가</Button>} />
      </div>
      <Separator />
      <div className="flex flex-wrap gap-4">
        {data?.map((item) => (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-12">
                <span className="sr-only">Open menu</span>
                {item.id} - {item.name} ({item.mid_fields?.length || 0})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div onClick={(e) => e.stopPropagation()}>
                <MajorFieldDialog
                  majorField={item}
                  onSave={(updatedField) => handleUpdateMajorField(item.id, updatedField)}
                  trigger={
                    <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                      수정
                    </button>
                  }
                />
              </div>
              <DropdownMenuItem
                onClick={() => handleDeleteMajorField(item.id)}
                className="cursor-pointer text-red-500"
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
};

export default MajorFieldManagement;
