'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { University } from '@/apis/hooks/use-universities';
import { RegionBadge } from '@/components/badges/region-badge';

export const columns: ColumnDef<University>[] = [
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
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='지역' />
    ),
    cell: ({ row }) => (
      <div className='w-[140px]'>
        <RegionBadge name={row.original.region.name} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='대학명' />
    ),
    cell: ({ row }) => (
      <div className='w-[140px]'>
        <RegionBadge name={row.original.name} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='주소' />
    ),
    cell: ({ row }) => (
      <div className='line-clamp-1 w-[200px]'>{row.original.address}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'homepage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='홈페이지' />
    ),
    cell: ({ row }) => (
      <a
        href={row.original.homepage}
        target='_blank'
        className='line-clamp-1 w-[200px] text-blue-500 underline'
      >
        {row.original.homepage}
      </a>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'universityCount',
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
    sortingFn: (a, b) =>
      (a.original.earlyAdmissionCount ?? 0) -
      (b.original.earlyAdmissionCount ?? 0),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
