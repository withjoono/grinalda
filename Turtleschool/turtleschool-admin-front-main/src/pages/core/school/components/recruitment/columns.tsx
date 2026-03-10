import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IconBubble } from '@tabler/icons-react';
import { toast } from 'sonner';
import {
  useDeleteRecruitmentUnit,
  useUpdateRecruitmentUnit,
} from '@/hooks/use-recruitment-queries';
import { IRecruitmentUnitData, IUpdateRecruitmentUnitDto } from '@/api/types/recruitment';
import { RecruitmentUnitDialog } from './recruitment-dialog';

export const columns: ColumnDef<IRecruitmentUnitData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{row.original.id}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: '모집단위명',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[180px] max-w-xs text-center">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'recruitment_number',
    header: '모집인원',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[100px] max-w-xs text-center">
        {row.original.recruitment_number}
      </div>
    ),
  },
  {
    accessorKey: 'general_field.name',
    header: '계열',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[70px] max-w-xs text-center">
        {row.original.general_field?.name || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'minor_field.name',
    header: '소계열',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[100px] max-w-xs text-center">
        {row.original.minor_field?.name || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'scores.grade_50_cut',
    header: '등급 50% 컷',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.scores?.grade_50_cut
          ? parseFloat(row.original.scores.grade_50_cut.toString() || '0').toFixed(2)
          : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'scores.grade_70_cut',
    header: '등급 70% 컷',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.scores?.grade_70_cut
          ? parseFloat(row.original.scores.grade_70_cut.toString() || '0').toFixed(2)
          : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'scores.convert_50_cut',
    header: '환산 50% 컷',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.scores?.convert_50_cut
          ? parseFloat(row.original.scores.convert_50_cut.toString() || '0').toFixed(2)
          : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'scores.convert_70_cut',
    header: '환산 70% 컷',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.scores?.convert_70_cut
          ? parseFloat(row.original.scores.convert_70_cut.toString() || '0').toFixed(2)
          : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'minimum_grade.is_applied',
    header: '최저학력기준 적용',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.minimum_grade?.is_applied === 'Y' ? '예' : '아니오'}
      </div>
    ),
  },
  {
    accessorKey: 'minimum_grade.is_applied',
    header: '과거 입결 데이터',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[80px] max-w-xs text-center">
        {row.original.previous_results.length}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const updateRecruitmentUnitMutation = useUpdateRecruitmentUnit();
      const deleteRecruitmentUnitMutation = useDeleteRecruitmentUnit();
      const recruitmentUnit = row.original;

      const handleUpdateRecruitmentUnit = async (dto: IUpdateRecruitmentUnitDto) => {
        const result = await updateRecruitmentUnitMutation.mutateAsync({
          id: recruitmentUnit.id,
          data: dto,
        });
        if (result.success) {
          toast.success('성공적으로 모집단위를 수정했습니다.');
        } else {
          toast.error(result.error);
        }
      };
      const handleDeleteRecruitmentUnit = async () => {
        if (window.confirm('정말 삭제할까요?')) {
          const result = await deleteRecruitmentUnitMutation.mutateAsync(recruitmentUnit.id);
          if (result.success) {
            toast.success('성공적으로 모집단위를 삭제했습니다.');
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
              <RecruitmentUnitDialog
                recruitmentUnit={recruitmentUnit}
                onUpdate={handleUpdateRecruitmentUnit}
                admissionId={recruitmentUnit.admission.id}
                trigger={
                  <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                    수정
                  </button>
                }
              />
            </div>
            <DropdownMenuItem
              onClick={handleDeleteRecruitmentUnit}
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
