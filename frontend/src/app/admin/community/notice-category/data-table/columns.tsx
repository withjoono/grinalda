'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { NoticeCategory } from '@/apis/hooks/use-boards';
import { NoticeCategoryBadge } from '@/components/badges/notice-category-badge';

export const columns: ColumnDef<NoticeCategory>[] = [
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
      <DataTableColumnHeader column={column} title='이름' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px]'>
        <NoticeCategoryBadge category={row.original} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'backgroundColor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='배경색' />
    ),
    cell: ({ row }) => {
      return (
        <div className='w-[120px]'>
          <span className='font-medium'>{row.original.backgroundColor}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'textColor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='텍스트 색' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px]'>{row.original.textColor}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
