import { AdminApiRoutes } from '@/constants/routes';
import { toUrl } from '@/lib/utils';
import { PaymentStatus } from '../use-payments';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/apis/utils';

export const paymentKeys = {
  history: ['payments-history'] as const,
  activeSubscriptions: ['active-subscriptions'] as const,
};

export interface AdminPayment {
  id: number;
  user: { id: number; name: string; email: string };
  product: { id: number; name: string; price: number; term: Date };
  coupon: {
    id: number;
    name: string;
    discountAmount: number;
  };
  orderId: string | null;
  tid: string | null;
  amount: number;
  goodsName: string;
  status: PaymentStatus;
  payMethod: string;
  paidAt: Date | null;
  cardCode: string | null;
  cardName: string | null;
  cardNum: string | null;
  cardQuota: number | null;
  cardType: string | null;
  receiptUrl: string | null;
  cancelledAt: Date | null;
  cancelAmount: number | null;
  cancelledTid: string | null;
  resultCode: string | null;
  resultMsg: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// [GET] /payments/admin 어드민 결제내역 조회
export const useGetAdminPayments = () => {
  return useQuery({
    queryKey: paymentKeys.history,
    queryFn: () =>
      Api.get<AdminPayment[]>(toUrl(AdminApiRoutes.DATA.PAYMENTS.GET)),
  });
};
