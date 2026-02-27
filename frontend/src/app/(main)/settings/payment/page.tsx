'use client';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Payment, useGetPaymentHistory } from '@/apis/hooks/use-payments';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { format } from 'date-fns';
import { PaymentStatusBadge } from '@/components/badges/payment-status-badge';
import { useState } from 'react';
import { ReceiptCard } from './recipt-card';
import { PaymentMethodBadge } from '@/components/badges/payment-method-badge';

export default function SettingsPaymentHistoryPage() {
  const {
    data: payments,
    isPending,
    isError,
    refetch,
  } = useGetPaymentHistory();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  if (isPending) return <LoadingSection />;
  if (isError)
    return <ErrorSection text='결제 내역 조회 실패' onRetry={refetch} />;

  if (selectedPayment) {
    return (
      <ReceiptCard
        payment={selectedPayment}
        onBack={() => setSelectedPayment(null)}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>결제 내역</h3>
          <p className='text-sm text-muted-foreground'>
            최근 12개월간의 결제 내역입니다.
          </p>
        </div>
      </div>
      <Separator />
      <div className='rounded-xl border bg-card'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px]'>결제일</TableHead>
              <TableHead className='hidden w-[100px] md:table-cell'>
                결제금액
              </TableHead>
              <TableHead>구독 플랜</TableHead>
              <TableHead className='hidden md:table-cell'>결제수단</TableHead>
              <TableHead className='hidden w-[140px] md:table-cell'>
                이용기한
              </TableHead>
              <TableHead className='w-[100px]'>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className='group cursor-pointer'
                onClick={() => setSelectedPayment(payment)}
              >
                <TableCell className='font-medium'>
                  {format(payment.paidAt, 'yyyy-MM-dd')}
                </TableCell>
                <TableCell className='hidden font-semibold md:table-cell'>
                  {payment.amount}
                </TableCell>
                <TableCell>{payment.goodsName}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  <PaymentMethodBadge name={payment.payMethod} />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <span className='text-md text-muted-foreground'>
                    {format(payment.product.term, 'yyyy-MM-dd')}까지
                  </span>
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge name={payment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
