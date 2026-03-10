import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useGeneralFields,
  useCreateGeneralField,
  useDeleteGeneralField,
  useUpdateGeneralField,
} from '@/hooks/use-fields-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IGeneralFieldData } from '@/api/types/fields-types';
import { GeneralFieldDialog } from './general-field-dialog';

const GeneralFieldManagement = () => {
  const { data, isLoading, error } = useGeneralFields();
  const createGeneralFieldMutation = useCreateGeneralField();
  const updateGeneralFieldMutation = useUpdateGeneralField();
  const deleteGeneralFieldMutation = useDeleteGeneralField();

  const handleAddGeneralField = async (newField: Omit<IGeneralFieldData, 'id'>) => {
    const result = await createGeneralFieldMutation.mutateAsync(newField);
    if (result.success) {
      toast.success('일반계열이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateGeneralField = async (
    id: number,
    updatedField: Omit<IGeneralFieldData, 'id'>
  ) => {
    const result = await updateGeneralFieldMutation.mutateAsync({ id, data: updatedField });
    if (result.success) {
      toast.success('일반계열이 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteGeneralField = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteGeneralFieldMutation.mutateAsync(id);
      if (result.success) {
        toast.success('일반계열이 성공적으로 삭제되었습니다.');
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
          title={`일반계열 관리 (${data?.length || 0})`}
          description="일반계열을 관리합니다."
        />
        <GeneralFieldDialog
          onSave={handleAddGeneralField}
          trigger={<Button>새 일반계열 추가</Button>}
        />
      </div>
      <Separator />
      <div className="flex flex-wrap gap-4">
        {data?.map((item) => (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-12">
                <span className="sr-only">Open menu</span>
                {item.id} - {item.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div onClick={(e) => e.stopPropagation()}>
                <GeneralFieldDialog
                  generalField={item}
                  onSave={(updatedField) => handleUpdateGeneralField(item.id, updatedField)}
                  trigger={
                    <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                      수정
                    </button>
                  }
                />
              </div>
              <DropdownMenuItem
                onClick={() => handleDeleteGeneralField(item.id)}
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

export default GeneralFieldManagement;
