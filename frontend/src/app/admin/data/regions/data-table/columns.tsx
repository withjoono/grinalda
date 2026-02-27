'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Region } from '@/apis/hooks/use-regions';
import { RegionBadge } from '@/components/badges/region-badge';

export const columns: ColumnDef<Region>[] = [
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
      <DataTableColumnHeader column={column} title='지역명' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        <RegionBadge name={row.original.name} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'universityCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='대학 수' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='font-medium'>{row.original.universityCount}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
