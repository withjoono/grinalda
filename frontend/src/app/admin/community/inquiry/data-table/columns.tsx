'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Inquiry } from '@/apis/hooks/use-boards';

export const columns: ColumnDef<Inquiry>[] = [
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
    accessorKey: 'author',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='질문자' />
    ),
    cell: ({ row }) => <div>{row.original.author.name}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'authorEmail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='질문자 이메일' />
    ),
    cell: ({ row }) => <div>{row.original.author.email}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'replies',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='답변상태' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px]'>
        {row.original.replies.length ? (
          <Badge variant='default'>답변완료</Badge>
        ) : (
          <Badge variant='outline'>답변대기</Badge>
        )}
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
