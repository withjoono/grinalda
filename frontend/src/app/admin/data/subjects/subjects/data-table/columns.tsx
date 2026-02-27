'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { SchoolSubject } from '@/apis/hooks/use-subjects';
import { RegionBadge } from '@/components/badges/region-badge';

export const columns: ColumnDef<SchoolSubject>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[40px]'>
        <Badge variant='outline'>{row.getValue('id')}</Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='코드' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        <span className='font-medium'>{row.original.code}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='과목명' />
    ),
    cell: ({ row }) => (
      <div className='w-[240px]'>
        <RegionBadge name={row.original.name} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'typeCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='과목유형' />
    ),
    cell: ({ row }) => {
      const typeCode = row.original.typeCode;
      return (
        <Badge variant='outline'>
          {typeCode === 1 ? '공통' : typeCode === 2 ? '선택' : '진로선택'}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
