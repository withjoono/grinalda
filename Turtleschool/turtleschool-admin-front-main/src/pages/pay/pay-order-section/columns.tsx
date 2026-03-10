import { ColumnDef } from '@tanstack/react-table';
import { PayOrder } from '@/api2/types/pay-order';
import { cn, formatDateYYYYMMDDHHMMSS } from '@/lib/utils';

export const columns: ColumnDef<PayOrder>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'member.nickname',
    id: 'nickname',
    header: '유저 이름',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('nickname')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'member.email',
    id: 'email',
    header: '유저 이메일',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('email')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'imp_uid',
    header: '아임포트 UID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('imp_uid')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'merchant_uid',
    header: '상품 UID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {row.getValue('merchant_uid')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'create_dt',
    header: '생성 날짜',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('create_dt')))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'update_dt',
    header: '업데이트 날짜',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('update_dt')))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'order_state',
    header: '주문 상태',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-[150px] text-center hover:line-clamp-none',
          row.getValue('order_state') === 'CANCEL' && 'text-red-500',
          row.getValue('order_state') === 'COMPLETE' && 'text-blue-500',
          row.getValue('order_state') === 'PENDING' && 'text-green-500'
        )}
      >
        {row.getValue('order_state')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'paid_amount',
    header: '결제 금액',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('paid_amount')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'cancel_amount',
    header: '취소 금액',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('cancel_amount')}
      </div>
    ),
    enableSorting: true,
  },
  // 간편결제 사용시 사용됨
  // {
  //   accessorKey: 'emb_pg_provider',
  //   header: 'PG사 제공자',
  //   cell: ({ row }) => (
  //     <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
  //       {row.getValue('emb_pg_provider')}
  //     </div>
  //   ),
  //   enableSorting: true,
  // },
  {
    accessorKey: 'card_name',
    header: '카드명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('card_name')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'card_number',
    header: '카드번호',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('card_number')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'pay_service_id',
    header: '상품 ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('pay_service_id')}
      </div>
    ),
    enableSorting: true,
  },
  // {
  //   accessorKey: 'vbank_code',
  //   header: '은행 코드',
  //   cell: ({ row }) => (
  //     <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
  //       {row.getValue('vbank_code')}
  //     </div>
  //   ),
  //   enableSorting: true,
  // },
  // {
  //   accessorKey: 'vbank_name',
  //   header: '은행 이름',
  //   cell: ({ row }) => (
  //     <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
  //       {row.getValue('vbank_name')}
  //     </div>
  //   ),
  //   enableSorting: true,
  // },
];
