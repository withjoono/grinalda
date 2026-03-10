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
import { useDeleteAdmission, useUpdateAdmission } from '@/hooks/use-admission-queries';
import { AdmissionDialog } from './admission-dialog';
import { IAdmissionData, IUpdateAdmissionDto } from '@/api/types/admission';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<IAdmissionData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{row.original.id}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: '전형명',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[180px] max-w-xs text-center">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'year',
    header: '년도',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{row.original.year}</div>
    ),
  },
  {
    accessorKey: 'basic_type',
    header: '기본 유형',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">
        {row.original.basic_type}{' '}
        {row.original.subtypes.length ? `(${row.original.subtypes.length})` : ''}
      </div>
    ),
  },
  {
    accessorKey: 'category.name',
    header: '카테고리',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-1 min-w-[100px] max-w-xs text-center',
          row.original.category.name === '학생부교과' && 'text-blue-500',
          row.original.category.name === '학생부종합' && 'text-purple-500'
        )}
      >
        {row.original.category.name}
      </div>
    ),
  },
  {
    accessorKey: 'method.method_description',
    header: '전형 방법',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[300px] max-w-xs">
        {row.original.method.method_description}
      </div>
    ),
  },
  {
    accessorKey: 'method.subject_ratio',
    header: '교과 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.subject_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.document_ratio',
    header: '서류 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.document_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.interview_ratio',
    header: '면접 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.interview_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.practical_ratio',
    header: '실기 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.practical_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.other_details',
    header: '기타 내역',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">
        {row.original.method.other_details || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'method.second_stage_first_ratio',
    header: '2단계 1단계 성적 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.second_stage_first_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.second_stage_interview_ratio',
    header: '2단계 면접 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.second_stage_interview_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.second_stage_other_ratio',
    header: '2단계 기타 비율',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[60px] max-w-xs text-center">{`${row.original.method.second_stage_other_ratio || 0}%`}</div>
    ),
  },
  {
    accessorKey: 'method.eligibility',
    header: '지원 자격',
    cell: ({ row }) => (
      <div className="line-clamp-1 min-w-[200px] max-w-xs text-center">{`${row.original.method.eligibility || '-'}`}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const updateAdmissionMutation = useUpdateAdmission();
      const deleteAdmissionMutation = useDeleteAdmission();
      const admission = row.original;

      const handleUpdateAdmission = async (dto: IUpdateAdmissionDto) => {
        const result = await updateAdmissionMutation.mutateAsync({ id: admission.id, data: dto });
        if (result.success) {
          toast.success('성공적으로 전형을 수정했습니다.');
        } else {
          toast.error(result.error);
        }
      };
      const handleDeleteAdmission = async () => {
        if (window.confirm('정말 삭제할까요?')) {
          const result = await deleteAdmissionMutation.mutateAsync(admission?.id);
          if (result.success) {
            toast.success('성공적으로 전형을 삭제했습니다.');
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
              <AdmissionDialog
                universityId={admission.university.id}
                admission={admission}
                onUpdate={handleUpdateAdmission}
                trigger={
                  <button className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                    수정
                  </button>
                }
              />
            </div>
            <DropdownMenuItem
              onClick={handleDeleteAdmission}
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
