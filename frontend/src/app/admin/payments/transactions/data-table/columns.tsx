'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { AdminPayment } from '@/apis/hooks/admin/use-admin-payments';
import { PaymentStatusBadge } from '@/components/badges/payment-status-badge';
import { PaymentMethodBadge } from '@/components/badges/payment-method-badge';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<AdminPayment>[] = [
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
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='사용자' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>
        {row.original.user.name} ({row.original.user.email})
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, _, value) => {
      return row.original.user.name.toString().includes(value);
    },
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='상품정보' />
    ),
    cell: ({ row }) => (
      <div className='w-[200px]'>
        <div className='font-medium'>{row.original.goodsName}</div>
        <div className='text-sm text-muted-foreground'>
          {formatPrice(row.original.product.price)}원
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'tid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='결제번호' />
    ),
    cell: ({ row }) => <div className='w-[200px]'>{row.original.tid}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'orderId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='주문번호' />
    ),
    cell: ({ row }) => <div className='w-[200px]'>{row.original.orderId}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='결제금액' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px]'>{formatPrice(row.original.amount)}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='상태' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>
        <PaymentStatusBadge name={row.original.status} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'payMethod',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='결제수단' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px]'>
        <PaymentMethodBadge name={row.original.payMethod} />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'paidAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='결제일시' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px]'>
        {row.original.paidAt
          ? format(row.original.paidAt, 'yyyy.MM.dd HH:mm')
          : ''}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {row.original.receiptUrl ? (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              if (row.original.receiptUrl) {
                window.open(row.original.receiptUrl, '_blank');
              }
            }}
          >
            영수증
          </Button>
        ) : (
          <Button variant='ghost' size='sm' disabled>
            영수증
          </Button>
        )}
      </div>
    ),
  },
];
