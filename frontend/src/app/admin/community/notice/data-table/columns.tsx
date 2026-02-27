'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Notice } from '@/apis/hooks/use-boards';
import { NoticeCategoryBadge } from '@/components/badges/notice-category-badge';

export const columns: ColumnDef<Notice>[] = [
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='카테고리' />
    ),
    cell: ({ row }) => (
      <div className='w-[140px]'>
        <NoticeCategoryBadge category={row.original.category} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='제목' />
    ),
    cell: ({ row }) => (
      <div className='line-clamp-2 w-[320px]'>{row.original.title}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='내용' />
    ),
    cell: ({ row }) => (
      <div className='line-clamp-2 w-[320px]'>{row.original.content}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='작성일' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>
        {new Date(row.original.createdAt).toLocaleString()}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='수정일' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>
        {new Date(row.original.updatedAt).toLocaleString()}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
