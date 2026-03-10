import { ColumnDef } from '@tanstack/react-table';
import { SusiPassRecord } from '@/api2/types/susi-pass-record';

export const columns: ColumnDef<SusiPassRecord>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'unified_id',
    header: '통합 아이디',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('unified_id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'region',
    header: '지역',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('region')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'department',
    header: '계열',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('department')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'university_name',
    header: '대학교 이름',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('university_name')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'recruitment_unit_name',
    header: '학과명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('recruitment_unit_name')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'central_classification',
    header: '전형유형',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('central_classification')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'basic_type',
    header: '일반, 특별',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('basic_type')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'type_name',
    header: '전형명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('type_name')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'first_result',
    header: '지원결과 1단계',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('first_result')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'final_result',
    header: '지원결과 최종',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('final_result')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'avg_grade_all',
    header: '평균등급 - 전과목',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('avg_grade_all')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'avg_grade_gyss',
    header: '평균등급 국영수사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('avg_grade_gyss')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'avg_grade_gysg',
    header: '평균등급 국영수과',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('avg_grade_gysg')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'avg_grade_gyst_100',
    header: '국영수탐 백분위',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('avg_grade_gyst_100')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'avg_grade_gyst',
    header: '평균등급 국영수탐',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[140px] text-center hover:line-clamp-none">
        {row.getValue('avg_grade_gyst')}
      </div>
    ),
    enableSorting: false,
  },
];
