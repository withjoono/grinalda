import { ColumnDef } from '@tanstack/react-table';
import { ISubjectCodeData } from '@/api/types/common-code-types';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<ISubjectCodeData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'subject_code',
    header: '과목 코드',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-full min-w-[140px] text-center hover:line-clamp-none">
        {row.getValue('subject_code')}
      </div>
    ),
  },
  {
    accessorKey: 'subject_name',
    header: '과목 이름',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-full min-w-[140px] text-center hover:line-clamp-none">
        {row.getValue('subject_name')}
      </div>
    ),
  },
  {
    accessorKey: 'course_type',
    header: '과목 종류',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-full min-w-[140px] text-center hover:line-clamp-none',
          row.getValue('course_type') === 0
            ? 'text-blue-500'
            : row.getValue('course_type') === 1
              ? 'text-purple-500'
              : 'text-purple-900'
        )}
      >
        {row.getValue('course_type') === 0
          ? '공통과목'
          : row.getValue('course_type') === 1
            ? '일반선택'
            : row.getValue('course_type') === 2
              ? '진로선택'
              : row.getValue('course_type') === 3
                ? '전문 교과Ⅰ'
                : '전문 교과ⅠI'}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: '평가방식',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-full min-w-[140px] text-center hover:line-clamp-none',
          row.getValue('type') === 0 ? 'text-blue-500' : 'text-purple-900'
        )}
      >
        {row.getValue('type') === 0 ? '석차등급' : '성취도'}
      </div>
    ),
  },
  {
    accessorKey: 'is_required',
    header: '필수/선택',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-full min-w-[140px] text-center hover:line-clamp-none',
          row.getValue('is_required') ? 'text-blue-500' : 'text-purple-500'
        )}
      >
        {row.getValue('is_required') ? '필수' : '선택'}
      </div>
    ),
  },
];
