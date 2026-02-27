'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Coupon } from '@/apis/hooks/admin/use-admin-coupons';
import { AdminProduct } from '@/apis/hooks/admin/use-admin-products';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export const columns: (products: AdminProduct[]) => ColumnDef<Coupon>[] = (
  products: AdminProduct[]
) => [
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
      <DataTableColumnHeader column={column} title='쿠폰명' />
    ),
    cell: ({ row }) => <div className='w-[200px]'>{row.original.name}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'memo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='메모' />
    ),
    cell: ({ row }) => <div className='w-[200px]'>{row.original.memo}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='쿠폰번호' />
    ),
    cell: ({ row }) => (
      <div className='w-[300px]'>
        <Badge
          variant='outline'
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(row.original.couponNumber);
            toast.info('쿠폰번호가 클립보드에 복사되었습니다.');
          }}
        >
          {row.original.couponNumber}
        </Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'discountAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='할인 금액' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='font-medium'>
            {formatPrice(row.original.discountAmount)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='수량' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.quantity}</span>
    ),
  },
  {
    accessorKey: 'serviceName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='서비스' />
    ),
    cell: ({ row }) => (
      <div className='w-[300px]'>
        <span className='font-medium'>
          {row.original.product.name} ({formatPrice(row.original.product.price)}
          원)
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'isDeleted',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='상태' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {row.original.isDeleted ? (
          <Badge variant='outline'>사용불가</Badge>
        ) : (
          <Badge variant='default'>사용가능</Badge>
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} products={products} />,
  },
];
