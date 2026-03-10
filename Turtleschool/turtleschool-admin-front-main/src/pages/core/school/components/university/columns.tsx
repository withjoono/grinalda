import { ColumnDef } from '@tanstack/react-table';
import { IUniversityData } from '@/api/types/university-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IconBubble } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useDeleteUniversity, useUpdateUniversity } from '@/hooks/use-university-queries';
import { UniversityDialog } from './university-dialog';

export const columns: ColumnDef<IUniversityData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="mx-auto line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: '대학명',
    cell: ({ row }) => (
      <div className="mx-auto line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'region',
    header: '지역',
    cell: ({ row }) => (
      <div className="mx-auto line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('region')}
      </div>
    ),
  },
  {
    accessorKey: 'code',
    header: '대학코드',
    cell: ({ row }) => (
      <div className="mx-auto line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('code')}
      </div>
    ),
  },
  {
    accessorKey: 'establishment_type',
    header: '설립형태',
    cell: ({ row }) => (
      <div className="mx-auto line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('establishment_type') || '-'}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const updateUniversityMutation = useUpdateUniversity();
      const deleteUniversityMutation = useDeleteUniversity();
      const university = row.original;

      const handleUpdateUniversity = async (
        id: number,
        updatedUniversity: Partial<IUniversityData>
      ) => {
        const result = await updateUniversityMutation.mutateAsync({ id, data: updatedUniversity });
        if (result.success) {
          toast.success('성공적으로 대학을 수정했습니다.');
        } else {
          toast.error(result.error);
        }
      };
      const handleDeleteUniversity = async () => {
        if (window.confirm('정말 삭제할까요?')) {
          const result = await deleteUniversityMutation.mutateAsync(university.id);
          if (result.success) {
            toast.success('성공적으로 대학을 삭제했습니다.');
          } else {
            toast.error(result.error);
          }
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconBubble className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div onClick={(e) => e.stopPropagation()}>
              <UniversityDialog
                university={university}
                onSave={(updatedUniversity) =>
                  handleUpdateUniversity(row.original.id, updatedUniversity)
                }
                trigger={
                  <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                    수정
                  </button>
                }
              />
            </div>
            <DropdownMenuItem
              onClick={handleDeleteUniversity}
              className="cursor-pointer text-red-500"
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
