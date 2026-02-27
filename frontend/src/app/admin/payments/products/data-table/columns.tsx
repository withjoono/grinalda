'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { AdminProduct } from '@/apis/hooks/admin/use-admin-products';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';

export const columns: ColumnDef<AdminProduct>[] = [
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
      <DataTableColumnHeader column={column} title='상품명' />
    ),
    cell: ({ row }) => <div className='w-[200px]'>{row.original.name}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='가격' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px]'>{formatPrice(row.original.price)}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'categoryCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='카테고리' />
    ),
    cell: ({ row }) => (
      <div className='w-[60px]'>{row.original.categoryCode}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'serviceCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='서비스코드' />
    ),
    cell: ({ row }) => (
      <div className='w-[60px]'>{row.original.serviceCode}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'term',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='만료 기간' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>{format(row.original.term, 'yyyy.MM.dd')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='활성 여부' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {row.original.active ? (
          <Badge variant={'default'}>활성</Badge>
        ) : (
          <Badge variant={'outline'}>비활성</Badge>
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'popular',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='인기 여부' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {row.original.popular ? (
          <Badge variant={'default'}>인기</Badge>
        ) : (
          <Badge variant={'outline'}>일반</Badge>
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'subTextAccent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='서브 텍스트 강조' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {row.original.subTextAccent ? (
          <Badge variant={'default'}>강조</Badge>
        ) : (
          <Badge variant={'outline'}>기본</Badge>
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='생성일' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {format(row.original.createdAt, 'yyyy.MM.dd')}
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
      <div className='w-[80px]'>
        {format(row.original.updatedAt, 'yyyy.MM.dd')}
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
