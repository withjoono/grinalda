import { Payment } from '@/apis/hooks/use-payments';
import { PaymentMethodBadge } from '@/components/badges/payment-method-badge';
import { PaymentStatusBadge } from '@/components/badges/payment-status-badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export const ReceiptCard = ({
  payment,
  onBack,
}: {
  payment: Payment;
  onBack: () => void;
}) => {
  return (
    <div className='mx-auto w-full max-w-screen-md px-2 py-20'>
      <div className='flex flex-col items-center justify-center p-2 dark:bg-gray-900'>
        <div className='w-full max-w-md rounded-lg border bg-white p-8 shadow-lg dark:bg-gray-800'>
          <div className='flex flex-col items-center justify-center space-y-6'>
            <div className='flex items-center gap-2'>
              <PaymentMethodBadge name={payment.payMethod} />
              <PaymentStatusBadge name={payment.status} />
            </div>
            <div className='space-y-2 text-center'>
              <h2 className='text-2xl font-bold'>주문 영수증</h2>
              <p className='text-gray-500 dark:text-gray-400'>
                결제하신 내역입니다.
              </p>
            </div>
            <div className='w-full rounded-lg bg-gray-100 p-4 dark:bg-gray-700'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-gray-500'>구매상품</div>
                <div className='col-span-2 text-right font-medium'>
                  {payment.product.name}
                </div>
                <div className='text-gray-500'>구매일</div>
                <div className='col-span-2 text-right text-sm font-medium'>
                  {payment.paidAt
                    ? format(new Date(payment.paidAt), 'yyyy-MM-dd HH:mm:ss')
                    : '알수없음'}
                </div>
                <div className='text-gray-500'>이용기간</div>
                <div className='col-span-2 text-right text-sm font-medium'>
                  {payment.product.term
                    ? `${format(new Date(payment.product.term), 'yyyy-MM-dd')} 까지`
                    : '알수없음'}
                </div>
                {payment.amount ? (
                  <>
                    <div className='text-gray-500'>결제 정보</div>
                    <div className='col-span-2 text-right text-sm font-medium'>
                      {payment.cardName} / {payment.cardNum}
                    </div>
                  </>
                ) : null}
                <div className='text-gray-500'>서비스 가격</div>
                <div className='col-span-2 text-right font-medium'>
                  {formatPrice(Number(payment.product.price))}
                </div>
                {payment.coupon ? (
                  <>
                    <div className='text-gray-500'>쿠폰 할인</div>
                    <div className='col-span-2 text-right font-medium text-red-500'>
                      - {formatPrice(payment.coupon.discountAmount)}
                    </div>
                    <div className='text-gray-500'>쿠폰명</div>
                    <div className='col-span-2 text-right font-medium'>
                      {payment.coupon.name}
                    </div>
                  </>
                ) : null}
                <div className='text-gray-500'>최종 결제 금액</div>
                <div className='col-span-2 text-right font-medium'>
                  {formatPrice(payment.amount || 0)}
                </div>
                {payment.cancelAmount ? (
                  <>
                    <div className='text-gray-500'>환불처리</div>
                    <div className='col-span-2 text-right font-medium text-blue-500'>
                      + {formatPrice(payment.cancelAmount || 0)}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <Button className={'w-full'} onClick={onBack}>
              결제 목록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
