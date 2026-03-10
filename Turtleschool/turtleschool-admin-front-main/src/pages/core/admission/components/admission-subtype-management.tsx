import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useAdmissionSubtypes,
  useCreateAdmissionSubtype,
  useDeleteAdmissionSubtype,
  useUpdateAdmissionSubtype,
} from '@/hooks/use-admission-subtype-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { AdmissionSubtypeDialog } from './admission-subtype-dialog';
import { IAdmissionSubtypeData } from '@/api/types/admission-subtypes';

const AdmissionSubtypeManagement = () => {
  const { data, isLoading, error } = useAdmissionSubtypes();
  const createAdmissionSubtypeMutation = useCreateAdmissionSubtype();
  const updateAdmissionSubtypeMutation = useUpdateAdmissionSubtype();
  const deleteAdmissionSubtypeMutation = useDeleteAdmissionSubtype();

  const handleAddAdmissionSubtype = async (newSubtype: IAdmissionSubtypeData) => {
    const result = await createAdmissionSubtypeMutation.mutateAsync(newSubtype);
    if (result.success) {
      toast.success('세부유형이 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateAdmissionSubtype = async (
    id: number,
    updatedSubtype: IAdmissionSubtypeData
  ) => {
    const result = await updateAdmissionSubtypeMutation.mutateAsync({ id, data: updatedSubtype });
    if (result.success) {
      toast.success('세부유형이 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteAdmissionSubtype = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteAdmissionSubtypeMutation.mutateAsync(id);
      if (result.success) {
        toast.success('세부유형이 성공적으로 삭제되었습니다.');
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
          title={`세부유형 관리 (${data?.length || 0})`}
          description="아이디는 생성 후 변경할 수 없으며 아이디와 세부전형명은 중복될 수 없습니다."
        />

        <AdmissionSubtypeDialog
          onSave={handleAddAdmissionSubtype}
          trigger={<Button>새 세부유형 추가</Button>}
        />
      </div>
      <Separator />
      <div className="flex flex-wrap gap-4">
        {data?.map((item) => {
          return (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-12">
                  <span className="sr-only">Open menu</span>
                  {item.id} - {item.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div onClick={(e) => e.stopPropagation()}>
                  <AdmissionSubtypeDialog
                    admissionSubtype={item}
                    onSave={(updatedSubtype) =>
                      handleUpdateAdmissionSubtype(item.id, updatedSubtype)
                    }
                    trigger={
                      <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                        수정
                      </button>
                    }
                  />
                </div>
                <DropdownMenuItem
                  onClick={() => handleDeleteAdmissionSubtype(item.id)}
                  className="cursor-pointer text-red-500"
                >
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
};

export default AdmissionSubtypeManagement;
