'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { AdmissionType } from '@/apis/hooks/use-admission-types';

export const columns: ColumnDef<AdmissionType>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='전형 유형명' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>
        <Badge variant='outline'>{row.original.name}</Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'earlyAdmissionCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='수시 전형 수' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='font-medium'>
            {row.original.earlyAdmissionCount}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
