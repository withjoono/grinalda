import React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import {
  useAdmissionCategories,
  useCreateAdmissionCategory,
  useDeleteAdmissionCategory,
  useUpdateAdmissionCategory,
} from '@/hooks/use-admission-category-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IAdmissionCategoryData } from '@/api/types/admission-category';
import { AdmissionCategoryDialog } from './admission-category-dialog';

const AdmissionCategoryManagement: React.FC = () => {
  const { data, isLoading, error } = useAdmissionCategories();
  const createAdmissionCategoryMutation = useCreateAdmissionCategory();
  const updateAdmissionCategoryMutation = useUpdateAdmissionCategory();
  const deleteAdmissionCategoryMutation = useDeleteAdmissionCategory();

  const handleAddAdmissionCategory = async (newCategory: Omit<IAdmissionCategoryData, 'id'>) => {
    const result = await createAdmissionCategoryMutation.mutateAsync(newCategory);
    if (result.success) {
      toast.success('중심전형분류가 성공적으로 추가되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateAdmissionCategory = async (
    id: number,
    updatedCategory: Omit<IAdmissionCategoryData, 'id'>
  ) => {
    const result = await updateAdmissionCategoryMutation.mutateAsync({ id, data: updatedCategory });
    if (result.success) {
      toast.success('중심전형분류가 성공적으로 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteAdmissionCategory = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteAdmissionCategoryMutation.mutateAsync(id);
      if (result.success) {
        toast.success('중심전형분류가 성공적으로 삭제되었습니다.');
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
          title={`중심전형분류 관리 (${data?.length || 0})`}
          description="중심전형분류를 관리합니다."
        />
        <AdmissionCategoryDialog
          onSave={handleAddAdmissionCategory}
          trigger={<Button>새 중심전형분류 추가</Button>}
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
                <AdmissionCategoryDialog
                  admissionCategory={item}
                  onSave={(updatedCategory) =>
                    handleUpdateAdmissionCategory(item.id, updatedCategory)
                  }
                  trigger={
                    <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                      수정
                    </button>
                  }
                />
              </div>
              <DropdownMenuItem
                onClick={() => handleDeleteAdmissionCategory(item.id)}
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

export default AdmissionCategoryManagement;
