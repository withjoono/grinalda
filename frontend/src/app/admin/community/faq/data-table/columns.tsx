'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { FAQ } from '@/apis/hooks/use-boards';

export const columns: ColumnDef<FAQ>[] = [
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
    accessorKey: 'question',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='질문' />
    ),
    cell: ({ row }) => (
      <div className='w-[240px]'>
        <span className='font-medium'>{row.original.question}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'answer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='답변' />
    ),
    cell: ({ row }) => {
      return (
        <div className='line-clamp-2 w-full'>
          <span className='font-medium'>{row.original.answer}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
